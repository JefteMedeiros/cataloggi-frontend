import Dexie, { type EntityTable } from 'dexie';

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Item {
  id: number;
  categoryId: number;
  name: string;
  firstLetter: string;
  content: string;
  updatedAt: string;
}

const db = new Dexie('CatalogDB') as Dexie & {
  categories: EntityTable<Category, 'id'>;
  items: EntityTable<Item, 'id'>;
};

db.version(1).stores({
  categories: 'id, slug',
  items: 'id, categoryId, firstLetter, name',
});

export { db };
