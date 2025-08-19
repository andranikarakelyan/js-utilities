// MultiSet implementation for js-utilities
// A MultiSet (bag) allows duplicate elements and counts occurrences.

export class MultiSet<T> {
  private map: Map<T, number> = new Map();

  add(item: T, count: number = 1): void {
    if (count <= 0) return;
    this.map.set(item, (this.map.get(item) || 0) + count);
  }

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

  count(item: T): number {
    return this.map.get(item) || 0;
  }

  has(item: T): boolean {
    return this.map.has(item);
  }

  size(): number {
    let total = 0;
    for (const v of this.map.values()) total += v;
    return total;
  }

  uniqueSize(): number {
    return this.map.size;
  }

  clear(): void {
    this.map.clear();
  }

  toArray(): T[] {
    const arr: T[] = [];
    for (const [item, count] of this.map.entries()) {
      for (let i = 0; i < count; i++) arr.push(item);
    }
    return arr;
  }

  entries(): IterableIterator<[T, number]> {
    return this.map.entries();
  }
}
