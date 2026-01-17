import type { TreeItem, TreeCategory } from "../../../types/tree";

/**
 * Builds a flat tree structure from category data
 */
export function buildTreeData(categories: TreeCategory[]): TreeItem[] {
  const result: TreeItem[] = [];

  categories.forEach((category, catIdx) => {
    const categoryId = `category-${catIdx}`;
    const categoryItem: TreeItem = {
      id: categoryId,
      description: category.category, // Set category name as description
      children: [],
    };

    category.subCategories.forEach((subCat, subIdx) => {
      const subCategoryId = `${categoryId}-sub-${subIdx}`;
      const subCategoryItem: TreeItem = {
        id: subCategoryId,
        description: subCat.subCategory, // Set subcategory name as description
        children: [],
      };

      subCat.items.forEach((item, itemIdx) => {
        const itemId = `${subCategoryId}-item-${itemIdx}`;
        subCategoryItem.children?.push({
          id: itemId,
          itemCode: item.itemCode,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        });
      });

      categoryItem.children?.push(subCategoryItem);
    });

    result.push(categoryItem);
  });

  return result;
}

/**
 * Sample data for tree table - Empty by default
 * This can be populated from BOM data or other sources
 */
export const sampleTreeData: TreeCategory[] = [];
