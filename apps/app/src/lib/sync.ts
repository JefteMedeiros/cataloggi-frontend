import { db } from '@/lib/db';
import type { Category, Item } from '@/lib/db';

const LAST_SYNCED_KEY = 'cataloggi_lastSyncedAt';
const MOCK_VERSION_KEY = 'cataloggi_mockVersion';

// Bump this string whenever the mock data in src/mocks/api.ts changes.
// On the next page load the local DB will be cleared and fully re-synced.
const DEV_MOCK_VERSION = '2';

interface ItemsPage {
  items: Item[];
  hasMore: boolean;
}

async function syncData(): Promise<void> {
  if (!navigator.onLine) return;

  try {
    const lastSyncedAt = localStorage.getItem(LAST_SYNCED_KEY) ?? '1970-01-01T00:00:00.000Z';

    // Sync categories (full refresh, no pagination)
    const categoriesRes = await fetch('/api/categories');
    if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
    const categories: Category[] = await categoriesRes.json();
    await db.categories.bulkPut(categories);

    // Sync items with pagination
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const params = new URLSearchParams({
        updated_after: lastSyncedAt,
        page: String(page),
        limit: '200',
      });
      const itemsRes = await fetch(`/api/items?${params.toString()}`);
      if (!itemsRes.ok) throw new Error('Failed to fetch items');
      const data: ItemsPage = await itemsRes.json();
      if (data.items.length > 0) {
        await db.items.bulkPut(data.items);
      }
      hasMore = data.hasMore;
      page++;
    }

    localStorage.setItem(LAST_SYNCED_KEY, new Date().toISOString());
  } catch (err) {
    console.error('[sync] Failed:', err);
  }
}

async function clearAndSync(): Promise<void> {
  localStorage.removeItem(LAST_SYNCED_KEY);
  await db.categories.clear();
  await db.items.clear();
  await syncData();
}

export function initSync(): void {
  if (import.meta.env.DEV) {
    const storedVersion = localStorage.getItem(MOCK_VERSION_KEY);
    if (storedVersion !== DEV_MOCK_VERSION) {
      localStorage.setItem(MOCK_VERSION_KEY, DEV_MOCK_VERSION);
      void clearAndSync();
      return;
    }
  }

  void syncData();
  window.addEventListener('online', () => void syncData());
}
