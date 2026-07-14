import Dexie, { type Table } from "dexie";
import type { Category, ItemDetail } from "./types";

export interface SyncMetadata {
  key: string;
  value: string;
}

class CataloggiDatabase extends Dexie {
  categories!: Table<Category, string>;
  items!: Table<ItemDetail, string>;
  syncMetadata!: Table<SyncMetadata, string>;

  constructor() {
    super("CataloggiDB");

    this.version(1).stores({
      categories: "id, name, slug, updatedAt",
      syncMetadata: "key",
    });

    this.version(2).stores({
      items: "id, categoryId, name, firstLetter, updatedAt",
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

export async function getItemsByCategoryId(categoryId: string): Promise<ItemDetail[]> {
  return db.items.where("categoryId").equals(categoryId).sortBy("name");
}

export async function putItems(items: ItemDetail[]): Promise<void> {
  await db.items.bulkPut(items);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return db.categories.where("slug").equals(slug).first();
}

export async function getItemById(id: string): Promise<ItemDetail | undefined> {
  return db.items.get(id);
}

export async function getAllItems(): Promise<ItemDetail[]> {
  return db.items.toArray();
}

export async function getSyncMetadata(key: string): Promise<string | undefined> {
  return (await db.syncMetadata.get(key))?.value;
}

export async function setSyncMetadata(key: string, value: string): Promise<void> {
  await db.syncMetadata.put({ key, value });
}
