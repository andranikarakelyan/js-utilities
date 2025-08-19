
/**
 * MultiSet (bag) implementation for js-utilities.
 * Allows duplicate elements and keeps count of each unique value.
 *
 * - Adding a negative count decreases the count, and removes the item if the count is zero or negative.
 * - Removing with a negative count increases the count.
 * - The count for any item is always positive or the item is absent.
 */

export class MultiSet<T> {
  private map: Map<T, number> = new Map();

  /**
   * Add an item to the MultiSet with the given count (default 1).
   * If count is negative, decreases the count. If the final count is zero or negative, removes the item.
   * @param item The item to add.
   * @param count The number of times to add (can be negative).
   */
  add(item: T, count: number = 1): void {
    if (count === 0) return;
    const current = this.map.get(item) || 0;
    const next = current + count;
    if (next > 0) {
      this.map.set(item, next);
    } else {
      this.map.delete(item);
    }
  }

  /**
   * Remove an item from the MultiSet with the given count (default 1).
   * If count is negative, increases the count (same as add with positive count).
   * If the final count is zero or negative, removes the item.
   * @param item The item to remove.
   * @param count The number of times to remove (can be negative).
   */
  remove(item: T, count: number = 1): void {
    if (count < 0) {
      this.add(item, -count);
      return;
    }
    if (!this.map.has(item)) return;
    const current = this.map.get(item)!;
    if (count >= current) {
      this.map.delete(item);
    } else {
      this.map.set(item, current - count);
    }
  }

  /**
   * Get the count of a specific item in the MultiSet.
   * @param item The item to count.
   * @returns The number of times the item appears (0 if not present).
   */
  count(item: T): number {
    return this.map.get(item) || 0;
  }

  /**
   * Check if the MultiSet contains the given item.
   * @param item The item to check.
   * @returns True if the item is present, false otherwise.
   */
  has(item: T): boolean {
    return this.map.has(item);
  }

  /**
   * Get the total number of items in the MultiSet (including duplicates).
   * @returns The total count of all items.
   */
  size(): number {
    let total = 0;
    for (const v of this.map.values()) total += v;
    return total;
  }

  /**
   * Get the number of unique items in the MultiSet.
   * @returns The number of unique items.
   */
  uniqueSize(): number {
    return this.map.size;
  }

  /**
   * Remove all items from the MultiSet.
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Convert the MultiSet to an array, repeating each item according to its count.
   * @returns An array of all items in the MultiSet.
   */
  toArray(): T[] {
    const arr: T[] = [];
    for (const [item, count] of this.map.entries()) {
      for (let i = 0; i < count; i++) arr.push(item);
    }
    return arr;
  }

  /**
   * Get an iterator over [item, count] pairs in the MultiSet.
   * @returns An iterator of [item, count] pairs.
   */
  entries(): IterableIterator<[T, number]> {
    return this.map.entries();
  }
}
