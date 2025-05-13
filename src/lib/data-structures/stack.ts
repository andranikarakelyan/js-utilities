/**
 * A generic Stack implementation with Last-In-First-Out (LIFO) behavior.
 * @template T The type of elements stored in the stack.
 */
export class Stack<T> {
  private items: T[] = [];

  /**
   * Adds an item to the top of the stack.
   * @param item The item to push onto the stack.
   * @returns The new length of the stack.
   */
  push(item: T): number {
    return this.items.push(item);
  }

  /**
   * Removes and returns the item at the top of the stack.
   * @returns The removed item, or undefined if the stack is empty.
   */
  pop(): T | undefined {
    return this.items.pop();
  }

  /**
   * Returns the item at the top of the stack without removing it.
   * @returns The top item, or undefined if the stack is empty.
   */
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  /**
   * Checks if the stack is empty.
   * @returns True if the stack has no items, false otherwise.
   */
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * Gets the number of items in the stack.
   * @returns The stack size.
   */
  size(): number {
    return this.items.length;
  }

  /**
   * Removes all items from the stack.
   */
  clear(): void {
    this.items = [];
  }

  /**
   * Returns all items in the stack as an array (without modifying the stack).
   * The first element in the array is the bottom of the stack, the last is the top.
   * @returns An array containing all stack items.
   */
  toArray(): T[] {
    return [...this.items];
  }
}