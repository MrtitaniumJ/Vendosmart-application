export interface TreeItem {
  id: string;
  itemCode?: string;
  description?: string;
  quantity?: number;
  rate?: number;
  children?: TreeItem[];
}

export interface TreeCategory {
  category: string;
  subCategories: TreeSubCategory[];
}

export interface TreeSubCategory {
  subCategory: string;
  items: TreeLeafItem[];
}

export interface TreeLeafItem {
  itemCode: string;
  description: string;
  quantity: number;
  rate: number;
}
