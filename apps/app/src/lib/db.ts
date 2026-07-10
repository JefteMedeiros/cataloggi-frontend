import Dexie, { type Table } from "dexie";

export interface Category {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
}

export interface SyncMetadata {
  key: string;
  value: string;
}

class CataloggiDatabase extends Dexie {
  categories!: Table<Category, string>;
  syncMetadata!: Table<SyncMetadata, string>;

  constructor() {
    super("CataloggiDB");

    this.version(1).stores({
      categories: "id, name, slug, updatedAt",
      syncMetadata: "key",
    });
  }
}

export const db = new CataloggiDatabase();

export async function getAllCategories(): Promise<Category[]> {
  return db.categories.orderBy("name").toArray();
}

export async function putCategories(categories: Category[]): Promise<void> {
  await db.categories.bulkPut(categories);
}

export async function getSyncMetadata(key: string): Promise<string | undefined> {
  return (await db.syncMetadata.get(key))?.value;
}

export async function setSyncMetadata(key: string, value: string): Promise<void> {
  await db.syncMetadata.put({ key, value });
}

export async function getNewestCategoryUpdatedAt(): Promise<string | undefined> {
  return (await db.categories.orderBy("updatedAt").last())?.updatedAt;
}
