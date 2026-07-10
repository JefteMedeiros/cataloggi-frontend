import { fetchCategoriesUpdatedAfter } from "@/lib/categories-api";
import {
  getNewestCategoryUpdatedAt,
  getSyncMetadata,
  putCategories,
  setSyncMetadata,
  type Category,
} from "@/lib/db";

const LAST_CATEGORY_SYNC_AT_KEY = "lastCategorySyncAt";
const INITIAL_SYNC_TIMESTAMP = "1970-01-01T00:00:00.000Z";
const CATEGORY_SYNC_PAGE_SIZE = 100;

export async function syncCategories(): Promise<void> {
  const lastSyncAt =
    (await getSyncMetadata(LAST_CATEGORY_SYNC_AT_KEY)) ??
    INITIAL_SYNC_TIMESTAMP;

  const updatedCategories: Category[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await fetchCategoriesUpdatedAfter(
      lastSyncAt,
      page,
      CATEGORY_SYNC_PAGE_SIZE,
    );

    updatedCategories.push(...response.items);
    totalPages = response.totalPages;
    page += 1;
  } while (page <= totalPages);

  if (updatedCategories.length > 0) await putCategories(updatedCategories);

  const latestStoredCategoryUpdatedAt = await getNewestCategoryUpdatedAt();
  const latestFetchedCategoryUpdatedAt = getNewestUpdatedAt(
    updatedCategories.map((category) => category.updatedAt),
  );

  const nextSyncAt = getNewestUpdatedAt([
    lastSyncAt,
    latestStoredCategoryUpdatedAt,
    latestFetchedCategoryUpdatedAt,
  ]);

  await setSyncMetadata(LAST_CATEGORY_SYNC_AT_KEY, nextSyncAt ?? lastSyncAt);
}

function getNewestUpdatedAt(
  values: Array<string | undefined>,
): string | undefined {
  return values
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => Date.parse(right) - Date.parse(left))[0];
}
