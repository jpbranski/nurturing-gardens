export interface ShoppingListItem {
  plantId: string;
  plantName: string;
  quantity: number;
  notes?: string;
}

export interface ShoppingList {
  items: ShoppingListItem[];
  zone?: string;
  updatedAt: string;
}
