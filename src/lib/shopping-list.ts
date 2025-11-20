import { ShoppingList, ShoppingListItem } from '@/types/shopping-list';

const STORAGE_KEY = 'nurturing-gardens-shopping-list';

/**
 * Get the shopping list from localStorage
 */
export function getShoppingList(): ShoppingList {
  if (typeof window === 'undefined') {
    return { items: [], updatedAt: new Date().toISOString() };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { items: [], updatedAt: new Date().toISOString() };
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading shopping list:', error);
    return { items: [], updatedAt: new Date().toISOString() };
  }
}

/**
 * Save the shopping list to localStorage
 */
export function saveShoppingList(list: ShoppingList): void {
  if (typeof window === 'undefined') return;

  try {
    list.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error('Error saving shopping list:', error);
  }
}

/**
 * Add a plant to the shopping list
 */
export function addToShoppingList(plantId: string, plantName: string): void {
  const list = getShoppingList();

  // Check if plant already exists
  const existingIndex = list.items.findIndex(item => item.plantId === plantId);

  if (existingIndex >= 0) {
    // Increment quantity if it already exists
    list.items[existingIndex].quantity += 1;
  } else {
    // Add new item
    list.items.push({
      plantId,
      plantName,
      quantity: 1,
    });
  }

  saveShoppingList(list);
}

/**
 * Remove a plant from the shopping list
 */
export function removeFromShoppingList(plantId: string): void {
  const list = getShoppingList();
  list.items = list.items.filter(item => item.plantId !== plantId);
  saveShoppingList(list);
}

/**
 * Update item quantity
 */
export function updateQuantity(plantId: string, quantity: number): void {
  const list = getShoppingList();
  const item = list.items.find(item => item.plantId === plantId);

  if (item) {
    item.quantity = Math.max(1, quantity);
    saveShoppingList(list);
  }
}

/**
 * Update item notes
 */
export function updateNotes(plantId: string, notes: string): void {
  const list = getShoppingList();
  const item = list.items.find(item => item.plantId === plantId);

  if (item) {
    item.notes = notes;
    saveShoppingList(list);
  }
}

/**
 * Clear the entire shopping list
 */
export function clearShoppingList(): void {
  const list: ShoppingList = {
    items: [],
    updatedAt: new Date().toISOString(),
  };
  saveShoppingList(list);
}

/**
 * Export shopping list as text file
 */
export function exportShoppingListAsText(zone?: string): string {
  const list = getShoppingList();

  let text = 'Nurturing Gardens – Shopping List\n';
  if (zone) {
    text += `Zone: ${zone}\n`;
  }
  text += `Generated: ${new Date().toLocaleDateString()}\n`;
  text += '--------------------------------\n\n';

  if (list.items.length === 0) {
    text += 'Your shopping list is empty.\n';
  } else {
    list.items.forEach((item, index) => {
      text += `${index + 1}) ${item.plantName} – Qty: ${item.quantity}\n`;
      if (item.notes) {
        text += `   Notes: ${item.notes}\n`;
      }
      text += '\n';
    });
  }

  return text;
}

/**
 * Download shopping list as .txt file
 */
export function downloadShoppingList(zone?: string): void {
  const text = exportShoppingListAsText(zone);
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `nurturing-gardens-shopping-list-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get the count of items in the shopping list
 */
export function getShoppingListCount(): number {
  const list = getShoppingList();
  return list.items.length;
}
