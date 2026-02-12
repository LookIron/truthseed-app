import { describe, it, expect, beforeEach } from 'vitest';
import {
  selectRandom,
  clearRecentItems,
  getRecentItemsCount,
} from '@/lib/randomSelector';

interface TestItem {
  id: string;
  value: string;
}

describe('Random Selector', () => {
  const testItems: TestItem[] = [
    { id: 'item-1', value: 'First' },
    { id: 'item-2', value: 'Second' },
    { id: 'item-3', value: 'Third' },
    { id: 'item-4', value: 'Fourth' },
    { id: 'item-5', value: 'Fifth' },
  ];

  beforeEach(() => {
    clearRecentItems();
  });

  it('should return null for empty array', () => {
    const result = selectRandom([]);
    expect(result).toBeNull();
  });

  it('should return the only item in single-item array', () => {
    const singleItem = [{ id: 'only', value: 'Only Item' }];
    const result = selectRandom(singleItem);
    expect(result).toEqual(singleItem[0]);
  });

  it('should return an item from the array', () => {
    const result = selectRandom(testItems);
    expect(result).not.toBeNull();
    expect(testItems).toContainEqual(result);
  });

  it('should be deterministic with seed', () => {
    const seed = 12345;
    const result1 = selectRandom(testItems, 3, seed);
    clearRecentItems();
    const result2 = selectRandom(testItems, 3, seed);

    expect(result1).toEqual(result2);
  });

  it('should avoid recently selected items', () => {
    const avoidCount = 2;
    const seed = 42;

    // Select first item
    const first = selectRandom(testItems, avoidCount, seed);
    expect(first).not.toBeNull();

    // Select second item (should be different)
    const second = selectRandom(testItems, avoidCount, seed + 1);
    expect(second).not.toBeNull();
    expect(second?.id).not.toBe(first?.id);

    // Select third item (should avoid first and second)
    const third = selectRandom(testItems, avoidCount, seed + 2);
    expect(third).not.toBeNull();
    expect(third?.id).not.toBe(first?.id);
    expect(third?.id).not.toBe(second?.id);

    // Fourth selection can now include first again (only avoiding last 2)
    const fourth = selectRandom(testItems, avoidCount, seed + 3);
    expect(fourth).not.toBeNull();
    // Fourth should avoid second and third, but first is now available
  });

  it('should track recent items count', () => {
    expect(getRecentItemsCount()).toBe(0);

    selectRandom(testItems, 3, 1);
    expect(getRecentItemsCount()).toBe(1);

    selectRandom(testItems, 3, 2);
    expect(getRecentItemsCount()).toBe(2);

    selectRandom(testItems, 3, 3);
    expect(getRecentItemsCount()).toBe(3);

    // Should cap at avoidCount
    selectRandom(testItems, 3, 4);
    expect(getRecentItemsCount()).toBe(3);
  });

  it('should clear recent items', () => {
    selectRandom(testItems, 3, 1);
    selectRandom(testItems, 3, 2);
    expect(getRecentItemsCount()).toBeGreaterThan(0);

    clearRecentItems();
    expect(getRecentItemsCount()).toBe(0);
  });

  it('should handle case when all items are recent', () => {
    // With only 2 items and avoid count of 2
    const twoItems = [
      { id: 'a', value: 'A' },
      { id: 'b', value: 'B' },
    ];

    const first = selectRandom(twoItems, 2, 1);
    expect(first).not.toBeNull();

    const second = selectRandom(twoItems, 2, 2);
    expect(second).not.toBeNull();

    // Third selection should still work (picks from all items)
    const third = selectRandom(twoItems, 2, 3);
    expect(third).not.toBeNull();
    expect([twoItems[0], twoItems[1]]).toContainEqual(third);
  });

  it('should generate different items without seed', () => {
    const selections = new Set();
    // Run multiple times and expect some variation
    for (let i = 0; i < 20; i++) {
      clearRecentItems();
      const result = selectRandom(testItems);
      if (result) selections.add(result.id);
    }

    // Should have selected at least 2 different items over 20 runs
    expect(selections.size).toBeGreaterThan(1);
  });
});
