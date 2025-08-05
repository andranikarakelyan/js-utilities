/**
 * A Least Recently Used (LRU) cache that maintains a fixed capacity and automatically
 * evicts the least recently accessed items when the cache reaches its limit.
 * 
 * @template K The type of keys used in the cache
 * @template V The type of values stored in the cache
 * 
 * @example
 * // Basic usage with string keys and number values
 * const cache = new LRUCache<string, number>(3);
 * cache.put('a', 1); // cache: ['a': 1]
 * cache.put('b', 2); // cache: ['a': 1, 'b': 2]
 * cache.put('c', 3); // cache: ['a': 1, 'b': 2, 'c': 3]
 * cache.get('a');    // Returns 1, 'a' becomes most recently used
 * cache.put('d', 4); // cache: ['a': 1, 'c': 3, 'd': 4] - 'b' was evicted
 * 
 * @example
 * // Usage for API response caching
 * interface ApiResponse {
 *   data: any;
 *   timestamp: number;
 * }
 * 
 * const apiCache = new LRUCache<string, ApiResponse>(100);
 * apiCache.put('/users/123', { data: userData, timestamp: Date.now() });
 * const cachedUser = apiCache.get('/users/123'); // Returns cached response
 * 
 * @example
 * // Function memoization with memory limits
 * const fibCache = new LRUCache<number, number>(50);
 * function fibonacci(n: number): number {
 *   if (fibCache.has(n)) return fibCache.get(n)!;
 *   const result = n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
 *   fibCache.put(n, result);
 *   return result;
 * }
 */
export class LRUCache<K, V> {
  private readonly capacity: number;
  private cache: Map<K, V>;
  private accessOrder: K[];

  /**
   * Creates a new LRU cache with the specified capacity.
   * 
   * @param capacity The maximum number of items the cache can hold
   * @throws {Error} When capacity is not a positive integer
   * 
   * @example
   * const cache = new LRUCache<string, number>(100);
   */
  constructor(capacity: number) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error('Capacity must be a positive integer');
    }
    
    this.capacity = capacity;
    this.cache = new Map<K, V>();
    this.accessOrder = [];
  }

  /**
   * Retrieves a value from the cache and marks it as recently used.
   * 
   * @param key The key to retrieve
   * @returns The value associated with the key, or undefined if not found
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * cache.put('key1', 100);
   * const value = cache.get('key1'); // Returns 100, marks 'key1' as recently used
   * const missing = cache.get('missing'); // Returns undefined
   */
  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Move to end (most recently used)
    this.moveToEnd(key);
    return this.cache.get(key);
  }

  /**
   * Stores a key-value pair in the cache and marks it as recently used.
   * If the cache is at capacity, removes the least recently used item.
   * 
   * @param key The key to store
   * @param value The value to associate with the key
   * 
   * @example
   * const cache = new LRUCache<string, string>(2);
   * cache.put('first', 'value1');  // cache: ['first']
   * cache.put('second', 'value2'); // cache: ['first', 'second']
   * cache.put('third', 'value3');  // cache: ['second', 'third'] - 'first' evicted
   */
  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      // Update existing key
      this.cache.set(key, value);
      this.moveToEnd(key);
      return;
    }

    // Check if we need to evict
    if (this.cache.size >= this.capacity) {
      this.evictLeastRecentlyUsed();
    }

    // Add new key-value pair
    this.cache.set(key, value);
    this.accessOrder.push(key);
  }

  /**
   * Checks if a key exists in the cache without affecting its access order.
   * 
   * @param key The key to check
   * @returns True if the key exists, false otherwise
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * cache.put('key1', 100);
   * console.log(cache.has('key1')); // true
   * console.log(cache.has('missing')); // false
   */
  has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * Removes a key-value pair from the cache.
   * 
   * @param key The key to remove
   * @returns True if the key was removed, false if it didn't exist
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * cache.put('key1', 100);
   * const removed = cache.delete('key1'); // Returns true
   * const notFound = cache.delete('missing'); // Returns false
   */
  delete(key: K): boolean {
    if (!this.cache.has(key)) {
      return false;
    }

    this.cache.delete(key);
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    return true;
  }

  /**
   * Removes all items from the cache.
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * cache.put('key1', 1);
   * cache.put('key2', 2);
   * cache.clear();
   * console.log(cache.size()); // 0
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  /**
   * Returns the current number of items in the cache.
   * 
   * @returns The current size of the cache
   * 
   * @example
   * const cache = new LRUCache<string, number>(5);
   * cache.put('key1', 1);
   * cache.put('key2', 2);
   * console.log(cache.size()); // 2
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Returns the maximum capacity of the cache.
   * 
   * @returns The maximum number of items the cache can hold
   * 
   * @example
   * const cache = new LRUCache<string, number>(100);
   * console.log(cache.capacity()); // 100
   */
  getCapacity(): number {
    return this.capacity;
  }

  /**
   * Checks if the cache is empty.
   * 
   * @returns True if the cache contains no items, false otherwise
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * console.log(cache.isEmpty()); // true
   * cache.put('key1', 1);
   * console.log(cache.isEmpty()); // false
   */
  isEmpty(): boolean {
    return this.cache.size === 0;
  }

  /**
   * Checks if the cache is at maximum capacity.
   * 
   * @returns True if the cache is full, false otherwise
   * 
   * @example
   * const cache = new LRUCache<string, number>(2);
   * cache.put('key1', 1);
   * console.log(cache.isFull()); // false
   * cache.put('key2', 2);
   * console.log(cache.isFull()); // true
   */
  isFull(): boolean {
    return this.cache.size === this.capacity;
  }

  /**
   * Returns an iterator over the cache keys in order from least to most recently used.
   * 
   * @returns An iterator for cache keys
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * cache.put('a', 1);
   * cache.put('b', 2);
   * cache.get('a'); // 'a' becomes most recently used
   * 
   * for (const key of cache.keys()) {
   *   console.log(key); // 'b', 'a'
   * }
   */
  keys(): IterableIterator<K> {
    return this.accessOrder[Symbol.iterator]();
  }

  /**
   * Returns an iterator over the cache values in order from least to most recently used.
   * 
   * @returns An iterator for cache values
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * cache.put('a', 1);
   * cache.put('b', 2);
   * cache.get('a'); // 'a' becomes most recently used
   * 
   * for (const value of cache.values()) {
   *   console.log(value); // 2, 1
   * }
   */
  *values(): IterableIterator<V> {
    for (const key of this.accessOrder) {
      yield this.cache.get(key)!;
    }
  }

  /**
   * Returns an iterator over the cache entries in order from least to most recently used.
   * 
   * @returns An iterator for cache entries [key, value]
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * cache.put('a', 1);
   * cache.put('b', 2);
   * cache.get('a'); // 'a' becomes most recently used
   * 
   * for (const [key, value] of cache.entries()) {
   *   console.log(key, value); // 'b' 2, 'a' 1
   * }
   */
  *entries(): IterableIterator<[K, V]> {
    for (const key of this.accessOrder) {
      yield [key, this.cache.get(key)!];
    }
  }

  /**
   * Returns an iterator over the cache entries from least to most recently used.
   * Makes the cache iterable with for...of loops.
   * 
   * @returns An iterator for cache entries
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * cache.put('a', 1);
   * cache.put('b', 2);
   * 
   * for (const [key, value] of cache) {
   *   console.log(`${key}: ${value}`); // 'a: 1', 'b: 2'
   * }
   */
  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  /**
   * Executes a provided function once for each cache entry.
   * 
   * @param callback Function to execute for each entry
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * cache.put('a', 1);
   * cache.put('b', 2);
   * 
   * cache.forEach((value, key) => {
   *   console.log(`${key}: ${value}`);
   * });
   */
  forEach(callback: (value: V, key: K, cache: LRUCache<K, V>) => void): void {
    for (const [key, value] of this.entries()) {
      callback(value, key, this);
    }
  }

  /**
   * Returns an array of all cache entries in order from least to most recently used.
   * 
   * @returns Array of [key, value] pairs
   * 
   * @example
   * const cache = new LRUCache<string, number>(3);
   * cache.put('a', 1);
   * cache.put('b', 2);
   * const entries = cache.toArray(); // [['a', 1], ['b', 2]]
   */
  toArray(): [K, V][] {
    return Array.from(this.entries());
  }

  /**
   * Moves a key to the end of the access order (most recently used position).
   * 
   * @private
   * @param key The key to move
   */
  private moveToEnd(key: K): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }

  /**
   * Removes the least recently used item from the cache.
   * 
   * @private
   */
  private evictLeastRecentlyUsed(): void {
    if (this.accessOrder.length > 0) {
      const lruKey = this.accessOrder.shift()!;
      this.cache.delete(lruKey);
    }
  }
}
