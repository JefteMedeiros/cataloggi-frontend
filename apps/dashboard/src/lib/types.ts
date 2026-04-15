export type ItemSummary = {
  id: number;
  categoryId: number;
  name: string;
  firstLetter: string;
  updatedAt: string;
};

export type ItemDetail = {
  id: number;
  categoryId: number;
  name: string;
  firstLetter: string;
  content: string;
  updatedAt: string;
};

export type CreateItemDto = {
  categoryId: number;
  name: string;
  content: string;
};

export type UpdateItemDto = {
  name: string;
  content: string;
  categoryId: number;
};

export type CategoryDto = {
  id: number;
  name: string;
  slug: string;
  icon: string;
};

export type CreateCategoryDto = {
  name: string;
  slug: string;
  icon: string;
};
