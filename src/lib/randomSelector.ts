/**
 * Smart random selector that avoids immediate repeats
 * Uses session storage to track recently selected items
 */

const RECENT_ITEMS_KEY = 'truthseed-recent-items';
const DEFAULT_AVOID_COUNT = 3;

/**
 * Seeded random number generator for deterministic tests
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

/**
 * Get recently selected item IDs from session storage
 */
function getRecentItems(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = sessionStorage.getItem(RECENT_ITEMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save recently selected item IDs to session storage
 */
function saveRecentItems(items: string[]): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(items));
  } catch {
    // Silently fail if storage is not available
  }
}

/**
 * Add an item to the recent items list
 */
function addRecentItem(id: string, avoidCount: number): void {
  const recent = getRecentItems();
  const updated = [id, ...recent.filter((item) => item !== id)].slice(
    0,
    avoidCount
  );
  saveRecentItems(updated);
}

/**
 * Select a random item from an array, avoiding recently selected items
 * @param items Array of items with id property
 * @param avoidCount Number of recent items to avoid (default: 3)
 * @param seed Optional seed for deterministic random selection (for tests)
 * @returns Randomly selected item, or null if array is empty
 */
export function selectRandom<T extends { id: string }>(
  items: T[],
  avoidCount: number = DEFAULT_AVOID_COUNT,
  seed?: number
): T | null {
  if (items.length === 0) return null;
  if (items.length === 1) {
    addRecentItem(items[0].id, avoidCount);
    return items[0];
  }

  const recent = getRecentItems();
  const available = items.filter((item) => !recent.includes(item.id));

  // If all items are recent, just pick from all items
  const pool = available.length > 0 ? available : items;

  // Select random item
  const random = seed !== undefined ? seededRandom(seed) : Math.random;
  const index = Math.floor(random() * pool.length);
  const selected = pool[index];

  // Track as recent
  addRecentItem(selected.id, avoidCount);

  return selected;
}

/**
 * Clear recent items from storage
 * Useful for testing or when user wants to reset
 */
export function clearRecentItems(): void {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem(RECENT_ITEMS_KEY);
  } catch {
    // Silently fail
  }
}

/**
 * Get count of recently selected items
 */
export function getRecentItemsCount(): number {
  return getRecentItems().length;
}
