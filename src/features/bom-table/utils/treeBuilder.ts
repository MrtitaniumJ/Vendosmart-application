import type { BomRow } from "../../../types/bom";

export interface TreeNode extends BomRow {
  children: TreeNode[];
  level: number;
  isExpanded: boolean;
  id: string;
}

/**
 * Builds a tree structure from flat BOM data
 * Hierarchy: Category -> Sub Category 1 -> Sub Category 2 -> Item Code
 */
export function buildTreeFromBomData(data: BomRow[]): TreeNode[] {
  const categoryMap = new Map<string, TreeNode>();
  const subCategory1Map = new Map<string, TreeNode>();
  const subCategory2Map = new Map<string, TreeNode>();

  // Process each row
  for (const row of data) {
    const categoryKey = row.category || "Uncategorized";
    const subCat1Key = row.subCategory1 || "";
    const subCat2Key = row.subCategory2 || "";
    const itemKey = row.itemCode || "";

    // Get or create category node
    let categoryNode = categoryMap.get(categoryKey);
    if (!categoryNode) {
      categoryNode = {
        ...row,
        itemCode: categoryKey,
        material: categoryKey,
        description: categoryKey,
        level: 0,
        isExpanded: true,
        id: `category-${categoryKey}`,
        children: [],
        quantity: null,
        estimatedRate: null,
        suppliers: {
          "Supplier 1 (Rate)": null,
          "Supplier 2 (Rate)": null,
          "Supplier 3 (Rate)": null,
          "Supplier 4 (Rate)": null,
          "Supplier 5 (Rate)": null,
        },
      };
      categoryMap.set(categoryKey, categoryNode);
    }

    // Calculate aggregated values for category (sum quantities, calculate weighted average rates)
    if (row.quantity !== null) {
      const currentQty = categoryNode.quantity || 0;
      categoryNode.quantity = currentQty + row.quantity;
    }
    // Calculate weighted average estimated rate
    if (row.estimatedRate !== null && row.quantity !== null && row.quantity > 0) {
      const currentQty = categoryNode.quantity || 0;
      const currentRate = categoryNode.estimatedRate || 0;
      const currentTotal = currentRate * (currentQty - row.quantity);
      const rowTotal = row.estimatedRate * row.quantity;
      categoryNode.estimatedRate = currentQty > 0 ? (currentTotal + rowTotal) / currentQty : null;
    }
    // Calculate weighted average supplier rates (only aggregate when supplier rate is not null)
    if (row.quantity !== null && row.quantity > 0) {
      const supplierKeys: Array<"Supplier 1 (Rate)" | "Supplier 2 (Rate)" | "Supplier 3 (Rate)" | "Supplier 4 (Rate)" | "Supplier 5 (Rate)"> = [
        "Supplier 1 (Rate)",
        "Supplier 2 (Rate)",
        "Supplier 3 (Rate)",
        "Supplier 4 (Rate)",
        "Supplier 5 (Rate)",
      ];
      for (const supplierKey of supplierKeys) {
        const rowSupplierRate = row.suppliers[supplierKey];
        if (rowSupplierRate !== null && row.quantity > 0) {
          const currentSupplierRate = categoryNode.suppliers[supplierKey];
          if (currentSupplierRate === null) {
            // First non-null value for this supplier
            categoryNode.suppliers[supplierKey] = rowSupplierRate;
          } else {
            // Calculate weighted average: (currentRate * currentQty + newRate * newQty) / totalQty
            // But we need to track the effective quantity that contributed to currentRate
            // For simplicity, we'll use the total category quantity
            const currentQty = categoryNode.quantity || 0;
            const currentTotal = currentSupplierRate * (currentQty - row.quantity);
            const rowTotal = rowSupplierRate * row.quantity;
            categoryNode.suppliers[supplierKey] = currentQty > 0 ? (currentTotal + rowTotal) / currentQty : null;
          }
        }
      }
    }

    // Get or create sub category 1 node
    if (subCat1Key) {
      const subCat1FullKey = `${categoryKey}-${subCat1Key}`;
      let subCat1Node = subCategory1Map.get(subCat1FullKey);
      if (!subCat1Node) {
        subCat1Node = {
          ...row,
          itemCode: subCat1Key,
          material: subCat1Key,
          description: subCat1Key,
          level: 1,
          isExpanded: true,
          id: `subcat1-${subCat1FullKey}`,
          children: [],
          quantity: null,
          estimatedRate: null,
          suppliers: {
            "Supplier 1 (Rate)": null,
            "Supplier 2 (Rate)": null,
            "Supplier 3 (Rate)": null,
            "Supplier 4 (Rate)": null,
            "Supplier 5 (Rate)": null,
          },
        };
        subCategory1Map.set(subCat1FullKey, subCat1Node);
        categoryNode.children.push(subCat1Node);
      }

      // Calculate aggregated values for sub category 1
      if (row.quantity !== null) {
        const currentQty = subCat1Node.quantity || 0;
        subCat1Node.quantity = currentQty + row.quantity;
      }
      // Calculate weighted average estimated rate
      if (row.estimatedRate !== null && row.quantity !== null && row.quantity > 0) {
        const currentQty = subCat1Node.quantity || 0;
        const currentRate = subCat1Node.estimatedRate || 0;
        const currentTotal = currentRate * (currentQty - row.quantity);
        const rowTotal = row.estimatedRate * row.quantity;
        subCat1Node.estimatedRate = currentQty > 0 ? (currentTotal + rowTotal) / currentQty : null;
      }
      // Calculate weighted average supplier rates (only aggregate when supplier rate is not null)
      if (row.quantity !== null && row.quantity > 0) {
        const supplierKeys: Array<"Supplier 1 (Rate)" | "Supplier 2 (Rate)" | "Supplier 3 (Rate)" | "Supplier 4 (Rate)" | "Supplier 5 (Rate)"> = [
          "Supplier 1 (Rate)",
          "Supplier 2 (Rate)",
          "Supplier 3 (Rate)",
          "Supplier 4 (Rate)",
          "Supplier 5 (Rate)",
        ];
        for (const supplierKey of supplierKeys) {
          const rowSupplierRate = row.suppliers[supplierKey];
          if (rowSupplierRate !== null && row.quantity > 0) {
            const currentSupplierRate = subCat1Node.suppliers[supplierKey];
            if (currentSupplierRate === null) {
              // First non-null value for this supplier
              subCat1Node.suppliers[supplierKey] = rowSupplierRate;
            } else {
              // Calculate weighted average
              const currentQty = subCat1Node.quantity || 0;
              const currentTotal = currentSupplierRate * (currentQty - row.quantity);
              const rowTotal = rowSupplierRate * row.quantity;
              subCat1Node.suppliers[supplierKey] = currentQty > 0 ? (currentTotal + rowTotal) / currentQty : null;
            }
          }
        }
      }

      // Get or create sub category 2 node
      if (subCat2Key) {
        const subCat2FullKey = `${subCat1FullKey}-${subCat2Key}`;
        let subCat2Node = subCategory2Map.get(subCat2FullKey);
        if (!subCat2Node) {
          subCat2Node = {
            ...row,
            itemCode: subCat2Key,
            material: subCat2Key,
            description: subCat2Key,
            level: 2,
            isExpanded: true,
            id: `subcat2-${subCat2FullKey}`,
            children: [],
            quantity: null,
            estimatedRate: null,
            suppliers: {
              "Supplier 1 (Rate)": null,
              "Supplier 2 (Rate)": null,
              "Supplier 3 (Rate)": null,
              "Supplier 4 (Rate)": null,
              "Supplier 5 (Rate)": null,
            },
          };
          subCategory2Map.set(subCat2FullKey, subCat2Node);
          subCat1Node.children.push(subCat2Node);
        }

        // Calculate aggregated values for sub category 2
        if (row.quantity !== null) {
          const currentQty = subCat2Node.quantity || 0;
          subCat2Node.quantity = currentQty + row.quantity;
        }
        // Calculate weighted average estimated rate
        if (row.estimatedRate !== null && row.quantity !== null && row.quantity > 0) {
          const currentQty = subCat2Node.quantity || 0;
          const currentRate = subCat2Node.estimatedRate || 0;
          const currentTotal = currentRate * (currentQty - row.quantity);
          const rowTotal = row.estimatedRate * row.quantity;
          subCat2Node.estimatedRate = currentQty > 0 ? (currentTotal + rowTotal) / currentQty : null;
        }
        // Calculate weighted average supplier rates (only aggregate when supplier rate is not null)
        if (row.quantity !== null && row.quantity > 0) {
          const supplierKeys: Array<"Supplier 1 (Rate)" | "Supplier 2 (Rate)" | "Supplier 3 (Rate)" | "Supplier 4 (Rate)" | "Supplier 5 (Rate)"> = [
            "Supplier 1 (Rate)",
            "Supplier 2 (Rate)",
            "Supplier 3 (Rate)",
            "Supplier 4 (Rate)",
            "Supplier 5 (Rate)",
          ];
          for (const supplierKey of supplierKeys) {
            const rowSupplierRate = row.suppliers[supplierKey];
            if (rowSupplierRate !== null && row.quantity > 0) {
              const currentSupplierRate = subCat2Node.suppliers[supplierKey];
              if (currentSupplierRate === null) {
                // First non-null value for this supplier
                subCat2Node.suppliers[supplierKey] = rowSupplierRate;
              } else {
                // Calculate weighted average
                const currentQty = subCat2Node.quantity || 0;
                const currentTotal = currentSupplierRate * (currentQty - row.quantity);
                const rowTotal = rowSupplierRate * row.quantity;
                subCat2Node.suppliers[supplierKey] = currentQty > 0 ? (currentTotal + rowTotal) / currentQty : null;
              }
            }
          }
        }

        // Add item as child of sub category 2
        const itemNode: TreeNode = {
          ...row,
          level: 3,
          isExpanded: false,
          id: `item-${row.id || itemKey}`,
          children: [],
        };
        subCat2Node.children.push(itemNode);
      } else {
        // Add item directly as child of sub category 1
        const itemNode: TreeNode = {
          ...row,
          level: 2,
          isExpanded: false,
          id: `item-${row.id || itemKey}`,
          children: [],
        };
        subCat1Node.children.push(itemNode);
      }
    } else {
      // Add item directly as child of category
      const itemNode: TreeNode = {
        ...row,
        level: 1,
        isExpanded: false,
        id: `item-${row.id || itemKey}`,
        children: [],
      };
      categoryNode.children.push(itemNode);
    }
  }

  return Array.from(categoryMap.values());
}
