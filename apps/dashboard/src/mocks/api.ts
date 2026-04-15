import type {
  CategoryDto,
  CreateCategoryDto,
  CreateItemDto,
  ItemDetail,
  ItemSummary,
  UpdateItemDto,
} from "../lib/types";
import { getAutoCategoryFields } from "../lib/category-fields";

let mockCategories: CategoryDto[] = [
  { id: 1, name: "Ciência", ...getAutoCategoryFields("Ciência") },
  { id: 2, name: "História", ...getAutoCategoryFields("História") },
];

const now = new Date().toISOString();

let mockItems: ItemDetail[] = [
  {
    id: 1,
    categoryId: 1,
    name: "Fotossíntese",
    firstLetter: "P",
    content:
      "# Fotossíntese\n\nProcesso pelo qual as plantas convertem luz solar em energia.",
    updatedAt: now,
  },
  {
    id: 2,
    categoryId: 2,
    name: "Império Romano",
    firstLetter: "R",
    content: "# Império Romano\n\nUm dos maiores impérios da história antiga.",
    updatedAt: now,
  },
];

let nextCategoryId = 3;
let nextItemId = 3;

function toSummary(item: ItemDetail): ItemSummary {
  return {
    id: item.id,
    categoryId: item.categoryId,
    name: item.name,
    firstLetter: item.firstLetter,
    updatedAt: item.updatedAt,
  };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const originalFetch = window.fetch.bind(window);

window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const urlString = input instanceof Request ? input.url : String(input);
  const url = new URL(urlString, window.location.origin);
  const path = url.pathname;
  const method = (init?.method ?? "GET").toUpperCase();

  if (!path.startsWith("/api/admin/")) {
    return originalFetch(input, init);
  }

  const body = init?.body ? JSON.parse(init.body as string) : null;

  if (method === "POST" && path === "/api/admin/login") {
    return Promise.resolve(json({ token: "dev-token" }));
  }

  if (method === "GET" && path === "/api/admin/categories") {
    return Promise.resolve(json(mockCategories));
  }

  if (method === "POST" && path === "/api/admin/categories") {
    const dto = body as CreateCategoryDto;
    const name = dto.name.trim();
    const created: CategoryDto = {
      id: nextCategoryId++,
      name,
      ...getAutoCategoryFields(name),
    };
    mockCategories = [...mockCategories, created];
    return Promise.resolve(json(created, 201));
  }

  const categoryMatch = path.match(/^\/api\/admin\/categories\/(\d+)$/);
  if (categoryMatch) {
    const id = Number.parseInt(categoryMatch[1], 10);

    if (method === "PUT") {
      const dto = body as CreateCategoryDto;
      const name = dto.name.trim();
      mockCategories = mockCategories.map((category) =>
        category.id === id
          ? {
              ...category,
              name,
              ...getAutoCategoryFields(name),
            }
          : category
      );
      const updated = mockCategories.find((category) => category.id === id);
      if (!updated) {
        return Promise.resolve(new Response(null, { status: 404 }));
      }
      return Promise.resolve(json(updated));
    }

    if (method === "DELETE") {
      mockCategories = mockCategories.filter((category) => category.id !== id);
      return Promise.resolve(new Response(null, { status: 204 }));
    }
  }

  if (method === "GET" && path === "/api/admin/items") {
    return Promise.resolve(json(mockItems.map(toSummary)));
  }

  if (method === "POST" && path === "/api/admin/items") {
    const dto = body as CreateItemDto;
    const created: ItemDetail = {
      id: nextItemId++,
      ...dto,
      firstLetter: dto.name.charAt(0).toUpperCase(),
      updatedAt: new Date().toISOString(),
    };
    mockItems = [...mockItems, created];
    return Promise.resolve(json(created, 201));
  }

  const itemMatch = path.match(/^\/api\/admin\/items\/(\d+)$/);
  if (itemMatch) {
    const id = Number.parseInt(itemMatch[1], 10);

    if (method === "GET") {
      const item = mockItems.find((candidate) => candidate.id === id);
      if (!item) {
        return Promise.resolve(new Response(null, { status: 404 }));
      }
      return Promise.resolve(json(item));
    }

    if (method === "PUT") {
      const dto = body as UpdateItemDto;
      mockItems = mockItems.map((item) =>
        item.id === id
          ? {
              ...item,
              ...dto,
              firstLetter: dto.name.charAt(0).toUpperCase(),
              updatedAt: new Date().toISOString(),
            }
          : item
      );
      const updated = mockItems.find((item) => item.id === id);
      if (!updated) {
        return Promise.resolve(new Response(null, { status: 404 }));
      }
      return Promise.resolve(json(updated));
    }

    if (method === "DELETE") {
      mockItems = mockItems.filter((item) => item.id !== id);
      return Promise.resolve(new Response(null, { status: 204 }));
    }
  }

  return Promise.resolve(
    new Response(JSON.stringify({ message: "Não encontrado" }), { status: 404 })
  );
};
