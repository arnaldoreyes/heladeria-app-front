export interface CategoryNode {
  id: string;
  name: string;
  parent_id: string | null;
  [key: string]: any;
}

export function flattenCategoryTree(
  categories: CategoryNode[],
  parentId: string | null = null,
  depth = 0
): (CategoryNode & { depth: number })[] {
  let result: (CategoryNode & { depth: number })[] = [];

  const children = categories.filter((cat) => cat.parent_id === parentId);

  for (const child of children) {
    result.push({ ...child, depth });
    result = result.concat(flattenCategoryTree(categories, child.id, depth + 1));
  }

  return result;
}