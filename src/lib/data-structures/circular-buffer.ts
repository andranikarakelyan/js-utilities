/**
 * A fixed-size circular buffer (ring buffer) that overwrites the oldest elements
 * when the buffer is full and new elements are added.
 * 
 * @template T The type of elements stored in the buffer
 * 
 * @example
 * // Basic usage with numbers
 * const buffer = new CircularBuffer<number>(3);
 * buffer.push(1); // [1]
 * buffer.push(2); // [1, 2]
 * buffer.push(3); // [1, 2, 3]
 * buffer.push(4); // [2, 3, 4] - '1' was overwritten
 * 
 * @example
 * // Usage with objects
 * interface LogEntry {
 *   timestamp: Date;
 *   message: string;
 * }
 * 
 * const logs = new CircularBuffer<LogEntry>(100);
 * logs.push({ timestamp: new Date(), message: "User logged in" });
 * 
 * @example
 * // Rolling metrics
 * const responseTimesMs = new CircularBuffer<number>(50);
 * responseTimesMs.push(245);
 * responseTimesMs.push(189);
 * const average = responseTimesMs.toArray().reduce((a, b) => a + b) / responseTimesMs.size();
 */
export class CircularBuffer<T> {
  private buffer: Array<T | undefined>;
  private head: number = 0; // Points to the oldest element
  private tail: number = 0; // Points to the next position to insert
  private count: number = 0; // Current number of elements
  private readonly maxSize: number;

  /**
   * Creates a new circular buffer with the specified capacity.
   * 
   * @param capacity The maximum number of elements the buffer can hold
   * @throws {Error} When capacity is not a positive integer
   */
  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('Capacity must be a positive integer');
    }
    
    this.maxSize = capacity;
    this.buffer = new Array(capacity);
  }

  /**
   * Adds an element to the buffer. If the buffer is full, overwrites the oldest element.
   * 
   * @param item The item to add to the buffer
   * 
   * @example
   * const buffer = new CircularBuffer<string>(2);
   * buffer.push("first");  // ["first"]
   * buffer.push("second"); // ["first", "second"]
   * buffer.push("third");  // ["second", "third"] - "first" was overwritten
   */
  push(item: T): void {
    this.buffer[this.tail] = item;
    
    if (this.isFull()) {
      // Buffer is full, move head forward (oldest element is overwritten)
      this.head = (this.head + 1) % this.maxSize;
    } else {
      this.count++;
    }
    
    this.tail = (this.tail + 1) % this.maxSize;
  }

  /**
   * Removes and returns the oldest element from the buffer.
   * 
   * @returns The oldest element, or undefined if the buffer is empty
   * 
   * @example
   * const buffer = new CircularBuffer<number>(3);
   * buffer.push(1);
   * buffer.push(2);
   * const oldest = buffer.shift(); // Returns 1, buffer now contains [2]
   */
  shift(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    
    const item = this.buffer[this.head];
    this.buffer[this.head] = undefined;
    this.head = (this.head + 1) % this.maxSize;
    this.count--;
    
    return item;
  }

  /**
   * Gets the element at the specified index without removing it.
   * Index 0 refers to the oldest element, index (size-1) refers to the newest element.
   * 
   * @param index The index of the element to retrieve (0-based)
   * @returns The element at the specified index
   * @throws {Error} When index is out of bounds
   * 
   * @example
   * const buffer = new CircularBuffer<string>(3);
   * buffer.push("a");
   * buffer.push("b");
   * buffer.push("c");
   * console.log(buffer.get(0)); // "a" (oldest)
   * console.log(buffer.get(2)); // "c" (newest)
   */
  get(index: number): T {
    if (index < 0 || index >= this.count) {
      throw new Error(`Index ${index} is out of bounds. Buffer size is ${this.count}`);
    }
    
    const actualIndex = (this.head + index) % this.maxSize;
    return this.buffer[actualIndex]!;
  }

  /**
   * Returns the newest element without removing it.
   * 
   * @returns The newest element, or undefined if the buffer is empty
   * 
   * @example
   * const buffer = new CircularBuffer<number>(3);
   * buffer.push(1);
   * buffer.push(2);
   * console.log(buffer.peek()); // 2
   */
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    
    const lastIndex = this.tail === 0 ? this.maxSize - 1 : this.tail - 1;
    return this.buffer[lastIndex];
  }

  /**
   * Returns the oldest element without removing it.
   * 
   * @returns The oldest element, or undefined if the buffer is empty
   * 
   * @example
   * const buffer = new CircularBuffer<number>(3);
   * buffer.push(1);
   * buffer.push(2);
   * console.log(buffer.peekOldest()); // 1
   */
  peekOldest(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    
    return this.buffer[this.head];
  }

  /**
   * Returns the current number of elements in the buffer.
   * 
   * @returns The current size of the buffer
   * 
   * @example
   * const buffer = new CircularBuffer<number>(5);
   * buffer.push(1);
   * buffer.push(2);
   * console.log(buffer.size()); // 2
   */
  size(): number {
    return this.count;
  }

  /**
   * Returns the maximum capacity of the buffer.
   * 
   * @returns The maximum number of elements the buffer can hold
   * 
   * @example
   * const buffer = new CircularBuffer<number>(5);
   * console.log(buffer.capacity()); // 5
   */
  capacity(): number {
    return this.maxSize;
  }

  /**
   * Checks if the buffer is full.
   * 
   * @returns True if the buffer is at maximum capacity, false otherwise
   * 
   * @example
   * const buffer = new CircularBuffer<number>(2);
   * buffer.push(1);
   * console.log(buffer.isFull()); // false
   * buffer.push(2);
   * console.log(buffer.isFull()); // true
   */
  isFull(): boolean {
    return this.count === this.maxSize;
  }

  /**
   * Checks if the buffer is empty.
   * 
   * @returns True if the buffer contains no elements, false otherwise
   * 
   * @example
   * const buffer = new CircularBuffer<number>(3);
   * console.log(buffer.isEmpty()); // true
   * buffer.push(1);
   * console.log(buffer.isEmpty()); // false
   */
  isEmpty(): boolean {
    return this.count === 0;
  }

  /**
   * Removes all elements from the buffer.
   * 
   * @example
   * const buffer = new CircularBuffer<number>(3);
   * buffer.push(1);
   * buffer.push(2);
   * buffer.clear();
   * console.log(buffer.isEmpty()); // true
   */
  clear(): void {
    this.buffer.fill(undefined);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  /**
   * Converts the buffer to a regular array with elements in order from oldest to newest.
   * 
   * @returns A new array containing all elements in order
   * 
   * @example
   * const buffer = new CircularBuffer<number>(3);
   * buffer.push(1);
   * buffer.push(2);
   * buffer.push(3);
   * buffer.push(4); // Overwrites 1
   * console.log(buffer.toArray()); // [2, 3, 4]
   */
  toArray(): T[] {
    const result: T[] = [];
    for (let i = 0; i < this.count; i++) {
      result.push(this.get(i));
    }
    return result;
  }

  /**
   * Returns an iterator for the buffer elements from oldest to newest.
   * 
   * @returns An iterator for the buffer elements
   * 
   * @example
   * const buffer = new CircularBuffer<number>(3);
   * buffer.push(1);
   * buffer.push(2);
   * buffer.push(3);
   * 
   * for (const item of buffer) {
   *   console.log(item); // 1, 2, 3
   * }
   */
  *[Symbol.iterator](): Iterator<T> {
    for (let i = 0; i < this.count; i++) {
      yield this.get(i);
    }
  }
}
