/**
 * A generic Queue implementation with First-In-First-Out (FIFO) behavior.
 * @template T The type of elements stored in the queue.
 */
export class Queue<T> {
  private items: T[] = [];

  /**
   * Adds an item to the end of the queue.
   * @param item The item to add to the queue.
   * @returns The new length of the queue.
   */
  enqueue(item: T): number {
    return this.items.push(item);
  }

  /**
   * Removes and returns the item at the front of the queue.
   * @returns The removed item, or undefined if the queue is empty.
   */
  dequeue(): T | undefined {
    return this.items.shift();
  }

  /**
   * Returns the item at the front of the queue without removing it.
   * @returns The front item, or undefined if the queue is empty.
   */
  peek(): T | undefined {
    return this.items[0];
  }

  /**
   * Checks if the queue is empty.
   * @returns True if the queue has no items, false otherwise.
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Gets the number of items in the queue.
   * @returns The queue size.
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Removes all items from the queue.
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Returns all items in the queue as an array (without modifying the queue).
   * The first element in the array is the front of the queue, the last is the back.
   * @returns An array containing all queue items.
   */
  toArray(): T[] {
    return [...this.items];
  }
}