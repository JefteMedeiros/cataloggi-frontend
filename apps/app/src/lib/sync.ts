import { apiFetch } from "@/lib/api";
import { putCategories, putItems } from "@/lib/db";
import type { Category, ItemDetail, PaginatedResponse } from "@/lib/types";

const SYNC_INTERVAL_KEY = "cataloggi:last-sync";
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;
const PAGE_SIZE = 100;

async function fetchAllCategories(): Promise<Category[]> {
  const all: Category[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await apiFetch<PaginatedResponse<Category>>(
      `/api/categories?page=${page}&pageSize=${PAGE_SIZE}`,
    );
    all.push(...res.items);
    totalPages = res.totalPages;
    page += 1;
  } while (page <= totalPages);

  return all;
}

async function fetchAllItems(): Promise<ItemDetail[]> {
  const all: ItemDetail[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const res = await apiFetch<PaginatedResponse<ItemDetail>>(
      `/api/items?page=${page}&pageSize=${PAGE_SIZE}`,
    );
    all.push(...res.items);
    totalPages = res.totalPages;
    page += 1;
  } while (page <= totalPages);

  return all;
}

export function getLastSyncTime(): Date | null {
  const raw = localStorage.getItem(SYNC_INTERVAL_KEY);
  if (!raw) return null;
  const ts = Number(raw);
  return Number.isNaN(ts) ? null : new Date(ts);
}

export function canAutoSync(): boolean {
  const last = getLastSyncTime();
  if (!last) return true;
  return Date.now() - last.getTime() >= SYNC_INTERVAL_MS;
}

export async function performSync(): Promise<Date> {
  const [categories, items] = await Promise.all([
    fetchAllCategories(),
    fetchAllItems(),
  ]);
  await Promise.all([putCategories(categories), putItems(items)]);
  const now = new Date();
  localStorage.setItem(SYNC_INTERVAL_KEY, String(now.getTime()));
  return now;
}
