import { apiFetch } from "@/lib/api";
import { db, addSyncHistory } from "@/lib/db";
import type {
  ItemDetail,
  SyncCategoryItem,
  SyncHistoryEntry,
  SyncItemSummary,
  SyncResponse,
} from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

const SYNC_INTERVAL_KEY = "cataloggi:last-sync";
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;
const LAST_SYNC_TIME_KEY = "cataloggi:last-sync-time";
const PAGE_SIZE = 500;
const BATCH_SIZE = 500;
const PARALLEL_BATCHES = 3;

export type SyncProgress = {
  step: "categories" | "items-summary" | "items-details" | "done";
  percentage: number;
  detail?: string;
};

export function getLastSyncTime(): Date | null {
  const raw = localStorage.getItem(LAST_SYNC_TIME_KEY);
  if (!raw) return null;
  const ts = Number(raw);
  return Number.isNaN(ts) ? null : new Date(ts);
}

export function canAutoSync(): boolean {
  const last = getLastSyncTime();
  if (!last) return true;
  return Date.now() - last.getTime() >= SYNC_INTERVAL_MS;
}

async function syncCategoriesPaged(
  since: string,
  page: number,
): Promise<SyncResponse<SyncCategoryItem>> {
  return apiFetch<SyncResponse<SyncCategoryItem>>(
    `/api/sync-categories?since=${encodeURIComponent(since)}&page=${page}&pageSize=${PAGE_SIZE}`,
  );
}

async function syncItemSummariesPaged(
  since: string,
  page: number,
): Promise<SyncResponse<SyncItemSummary>> {
  return apiFetch<SyncResponse<SyncItemSummary>>(
    `/api/sync-items?since=${encodeURIComponent(since)}&page=${page}&pageSize=${PAGE_SIZE}`,
  );
}

async function fetchItemsBatch(ids: string[]): Promise<ItemDetail[]> {
  if (ids.length === 0) return [];
  return apiFetch<ItemDetail[]>("/api/items/batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
}

async function fetchBatchesParallel(
  batches: string[][],
  onBatch: (batchIndex: number, total: number) => void,
): Promise<ItemDetail[]> {
  const totalBatches = batches.length;
  const results: ItemDetail[][] = new Array(totalBatches);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < totalBatches) {
      const i = nextIndex++;
      results[i] = await fetchItemsBatch(batches[i]);
      onBatch(i + 1, totalBatches);
    }
  }

  const workers = Array.from({ length: Math.min(PARALLEL_BATCHES, totalBatches) }, () => worker());
  await Promise.all(workers);

  return results.flat();
}

export async function performIncrementalSync(
  onProgress?: (progress: SyncProgress) => void,
): Promise<SyncHistoryEntry> {
  const syncId = uuidv4();
  const startedAt = new Date().toISOString();
  const lastSyncTime = localStorage.getItem(LAST_SYNC_TIME_KEY);
  const since = lastSyncTime
    ? new Date(Number(lastSyncTime)).toISOString()
    : new Date(0).toISOString();

  const historyEntry: SyncHistoryEntry = {
    id: syncId,
    startedAt,
    completedAt: null,
    status: "failed",
    categoriesUpdated: 0,
    categoriesDeleted: 0,
    itemsUpdated: 0,
    itemsDeleted: 0,
  };

  try {
    // Step 1: Paginate categories
    onProgress?.({ step: "categories", percentage: 0, detail: "Iniciando..." });

    const allCategoryUpdated: SyncCategoryItem[] = [];
    const allCategoryDeleted: string[] = [];
    let catPage = 1;
    let catTotalPages = 1;

    do {
      onProgress?.({
        step: "categories",
        percentage: Math.min(30, Math.round((catPage / Math.max(catTotalPages, 1)) * 30)),
        detail: `Página ${catPage}/${catTotalPages}`,
      });

      const response = await syncCategoriesPaged(since, catPage);
      allCategoryUpdated.push(...response.updated);
      allCategoryDeleted.push(...response.deleted);
      catTotalPages = response.totalPages ?? 1;
      catPage++;
    } while (catPage <= catTotalPages);

    onProgress?.({
      step: "categories",
      percentage: 33,
      detail: `${allCategoryUpdated.length} categorias`,
    });

    // Step 2: Paginate item summaries
    onProgress?.({ step: "items-summary", percentage: 33, detail: "Iniciando..." });

    const allItemSummaries: SyncItemSummary[] = [];
    const allItemDeleted: string[] = [];
    let itemPage = 1;
    let itemTotalPages = 1;

    do {
      onProgress?.({
        step: "items-summary",
        percentage:
          33 + Math.min(33, Math.round((itemPage / Math.max(itemTotalPages, 1)) * 33)),
        detail: `Página ${itemPage}/${itemTotalPages}`,
      });

      const response = await syncItemSummariesPaged(since, itemPage);
      allItemSummaries.push(...response.updated);
      allItemDeleted.push(...response.deleted);
      itemTotalPages = response.totalPages ?? 1;
      itemPage++;
    } while (itemPage <= itemTotalPages);

    historyEntry.itemsUpdated = allItemSummaries.length;
    historyEntry.itemsDeleted = allItemDeleted.length;

    onProgress?.({
      step: "items-summary",
      percentage: 66,
      detail: `${allItemSummaries.length} itens`,
    });

    // Step 3: Fetch full item details in parallel batches
    onProgress?.({ step: "items-details", percentage: 66, detail: "Carregando detalhes..." });

    const allIds = allItemSummaries.map((item) => item.id);
    const batches: string[][] = [];
    for (let i = 0; i < allIds.length; i += BATCH_SIZE) {
      batches.push(allIds.slice(i, i + BATCH_SIZE));
    }

    const allDetails = await fetchBatchesParallel(batches, (done, total) => {
      onProgress?.({
        step: "items-details",
        percentage: 66 + Math.round((done / Math.max(total, 1)) * 33),
        detail: `Lote ${done}/${total}`,
      });
    });

    // Step 4: Atomic write — single Dexie transaction
    onProgress?.({ step: "done", percentage: 99, detail: "Salvando dados..." });

    await db.transaction("rw", [db.categories, db.items], async () => {
      const categoryRecords = allCategoryUpdated.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        updatedAt: c.updatedAt,
      }));

      if (categoryRecords.length > 0) {
        await db.categories.bulkPut(categoryRecords);
      }
      if (allCategoryDeleted.length > 0) {
        await db.categories.bulkDelete(allCategoryDeleted);
      }

      if (allDetails.length > 0) {
        await db.items.bulkPut(allDetails);
      }
      if (allItemDeleted.length > 0) {
        await db.items.bulkDelete(allItemDeleted);
      }
    });

    historyEntry.categoriesUpdated = allCategoryUpdated.length;
    historyEntry.categoriesDeleted = allCategoryDeleted.length;

    onProgress?.({ step: "done", percentage: 100, detail: "Concluído" });

    historyEntry.completedAt = new Date().toISOString();
    historyEntry.status = "success";

    const now = new Date();
    localStorage.setItem(LAST_SYNC_TIME_KEY, String(now.getTime()));
    localStorage.setItem(SYNC_INTERVAL_KEY, String(now.getTime()));
  } catch {
    historyEntry.status = "failed";
    throw historyEntry;
  } finally {
    await addSyncHistory(historyEntry);
  }

  return historyEntry;
}
