import { slugify } from "./slug";

const DEFAULT_CATEGORY_ICON = "BookOpenIcon";

export function getAutoCategoryFields(name: string): { slug: string; icon: string } {
  const slug = slugify(name);
  const icon = slug.includes("hist") ? "ArchiveIcon" : DEFAULT_CATEGORY_ICON;

  return { slug, icon };
}
