# Features Documentation

This document provides detailed documentation for all features available in @andranik-arakelyan/js-utilities.

## Table of Contents

### [Data Structures](#data-structures)
- [Stack<T>](#stackt)
- [Queue<T>](#queuet)
- [CircularBuffer<T>](#circularbuffert)
- [LRUCache<K, V>](#lrucachek-v)
- [MultiSet<T>](#multisett)

### [Array Utilities](#array-utilities)
- [arraySubtract](#arraysubtract)
- [arraySplit](#arraysplit)
- [shuffle](#shuffle)
- [unique](#unique)
- [groupBy](#groupby)
- [chunk](#chunk)
- [flatten](#flatten)
- [intersection](#intersection)
- [difference](#difference)

### [Generator Utilities](#generator-utilities)
- [range](#range)
- [rangeIterable](#rangeiterable)

### [Object Utilities](#object-utilities)
- [deepClone](#deepclone)
- [deepMerge](#deepmerge)
- [jsonCompare](#jsoncompare)
- [flattenObject](#flattenobject)
- [unflattenObject](#unflattenobject)

### [Random Utilities](#random-utilities)
- [randomInt](#randomint)
- [randomBoolean](#randomboolean)

### [Runtime Utilities](#runtime-utilities)
- [currentCodeInfo](#currentcodeinfo)

### [Function Utilities](#function-utilities)
- [once](#once)
- [debounce](#debounce)
- [throttle](#throttle)

### [Promise Utilities](#promise-utilities)
- [wait](#wait)
- [retry](#retry)
- [safeAsync](#safeasync)
- [PromisePool](#promisepool)

### [Network Utilities](#network-utilities)
- [BaseApiClient](#baseapiclient)

---

## Data Structures

### MultiSet<T>
A MultiSet (bag) allows duplicate elements and counts how many times each value appears.
```ts
import { MultiSet } from '@andranik-arakelyan/js-utilities';

const ms = new MultiSet<number>();
ms.add(1);
ms.add(2, 3);
console.log(ms.count(1)); // 1
console.log(ms.count(2)); // 3
ms.remove(2);
console.log(ms.count(2)); // 2
console.log(ms.size()); // 3 (total items)
console.log(ms.uniqueSize()); // 2 (unique items)
console.log(ms.toArray()); // [1, 2, 2]
```

### Stack<T>
A generic type-safe implementation of a Stack data structure with LIFO (Last-In-First-Out) operations.
```ts
import { Stack } from '@andranik-arakelyan/js-utilities';

// Create a new stack of numbers
const stack = new Stack<number>();

// Push elements onto the stack
stack.push(1);
stack.push(2);
stack.push(3);

console.log(stack.peek()); // 3 (returns the top element without removing it)
console.log(stack.pop());  // 3 (removes and returns the top element)
console.log(stack.size()); // 2 (returns the current number of elements)
console.log(stack.isEmpty()); // false
```

### Queue<T>
A generic type-safe implementation of a Queue data structure with FIFO (First-In-First-Out) operations.
```ts
import { Queue } from '@andranik-arakelyan/js-utilities';

// Create a new queue of strings
const queue = new Queue<string>();

// Enqueue elements
queue.enqueue("first");
queue.enqueue("second");
queue.enqueue("third");

console.log(queue.peek()); // "first" (returns the front element without removing it)
console.log(queue.dequeue()); // "first" (removes and returns the front element)
console.log(queue.size()); // 2 (returns the current number of elements)
console.log(queue.isEmpty()); // false
```

### CircularBuffer<T>
A fixed-size circular buffer (ring buffer) that overwrites the oldest elements when the buffer is full and new elements are added. Perfect for implementing sliding windows, recent activity logs, and rolling metrics.

```ts
import { CircularBuffer } from '@andranik-arakelyan/js-utilities';

// Create a circular buffer with capacity of 3
const buffer = new CircularBuffer<number>(3);

// Add elements normally at first
buffer.push(1); // [1]
buffer.push(2); // [1, 2]  
buffer.push(3); // [1, 2, 3] - buffer is now full

// When full, new elements overwrite oldest
buffer.push(4); // [2, 3, 4] - '1' was overwritten
buffer.push(5); // [3, 4, 5] - '2' was overwritten

console.log(buffer.toArray()); // [3, 4, 5]
console.log(buffer.size()); // 3
console.log(buffer.capacity()); // 3
console.log(buffer.isFull()); // true

// Access elements
console.log(buffer.get(0)); // 3 (oldest element)
console.log(buffer.peek()); // 5 (newest element)
console.log(buffer.peekOldest()); // 3 (oldest element)

// Remove oldest element
const oldest = buffer.shift(); // 3
console.log(buffer.toArray()); // [4, 5]

// Clear all elements
buffer.clear();
console.log(buffer.isEmpty()); // true

// Works with any data type
const logBuffer = new CircularBuffer<{timestamp: Date, message: string}>(100);
logBuffer.push({timestamp: new Date(), message: "User logged in"});

// Iterable with for...of
for (const item of buffer) {
  console.log(item);
}
```

**Use Cases:**
- **Recent Activity Logs** - Keep track of last N user actions
- **Rolling Metrics** - Store last N measurements for analysis  
- **Sliding Window Data** - Maintain a moving window of data points
- **Undo/Redo Systems** - Store last N states for undo functionality
- **Rate Limiting** - Track recent requests for rate limiting

### LRUCache<K, V>
A Least Recently Used (LRU) cache that maintains a fixed capacity and automatically evicts the least recently accessed items when the cache reaches its limit. Perfect for implementing memory-efficient caches with intelligent eviction policies.

```ts
import { LRUCache } from '@andranik-arakelyan/js-utilities';

// Create a cache with capacity of 3
const cache = new LRUCache<string, number>(3);

// Add items normally at first
cache.put('a', 1); // cache: ['a': 1]
cache.put('b', 2); // cache: ['a': 1, 'b': 2]
cache.put('c', 3); // cache: ['a': 1, 'b': 2, 'c': 3] - now at capacity

// Access an item (marks it as recently used)
cache.get('a'); // Returns 1, order becomes: ['b': 2, 'c': 3, 'a': 1]

// When capacity is exceeded, least recently used item is evicted
cache.put('d', 4); // cache: ['c': 3, 'a': 1, 'd': 4] - 'b' was evicted

console.log(cache.has('b')); // false - 'b' was evicted
console.log(cache.get('a')); // 1 - 'a' still exists
console.log(cache.size()); // 3
console.log(cache.getCapacity()); // 3

// Check cache state
console.log(cache.isFull()); // true
console.log(cache.isEmpty()); // false

// Iterate over entries (from least to most recently used)
for (const [key, value] of cache) {
  console.log(`${key}: ${value}`); // 'c: 3', 'a: 1', 'd: 4'
}

// Get all entries as array
const entries = cache.toArray(); // [['c', 3], ['a', 1], ['d', 4]]

// Clear cache
cache.clear();
console.log(cache.isEmpty()); // true

// API Response Caching Example
interface ApiResponse {
  data: any;
  timestamp: number;
}

const apiCache = new LRUCache<string, ApiResponse>(100);

// Cache API responses
apiCache.put('/users/123', { 
  data: { id: 123, name: 'Alice' }, 
  timestamp: Date.now() 
});

// Retrieve cached response
const cachedUser = apiCache.get('/users/123');
if (cachedUser) {
  console.log('Cache hit:', cachedUser.data);
} else {
  console.log('Cache miss - fetch from API');
}

// Function Memoization Example
const fibCache = new LRUCache<number, number>(50);

function fibonacci(n: number): number {
  if (fibCache.has(n)) {
    return fibCache.get(n)!;
  }
  
  const result = n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
  fibCache.put(n, result);
  return result;
}

console.log(fibonacci(40)); // Computed with memoization
console.log(fibonacci(35)); // Retrieved from cache

// Database Query Cache Example
interface QueryResult {
  rows: any[];
  executionTime: number;
}

const queryCache = new LRUCache<string, QueryResult>(200);

function executeQuery(sql: string): QueryResult {
  if (queryCache.has(sql)) {
    console.log('Query cache hit');
    return queryCache.get(sql)!;
  }
  
  // Simulate expensive database query
  const result = {
    rows: [/* query results */],
    executionTime: 45
  };
  
  queryCache.put(sql, result);
  return result;
}

// Web Asset Cache Example
const assetCache = new LRUCache<string, Blob>(50);

async function loadAsset(url: string): Promise<Blob> {
  if (assetCache.has(url)) {
    return assetCache.get(url)!;
  }
  
  const response = await fetch(url);
  const blob = await response.blob();
  assetCache.put(url, blob);
  return blob;
}
```

**Key Features:**
- **Automatic Eviction** - Removes least recently used items when capacity is reached
- **Access-Based Ordering** - Tracks both `get()` and `put()` operations as "usage"
- **Memory Efficient** - Fixed memory footprint, never grows beyond capacity
- **Type Safe** - Full TypeScript generic support for keys and values
- **Iterable** - Supports for...of loops and iteration methods
- **Performance** - O(1) average time complexity for get/put operations

**Use Cases:**
- **API Response Caching** - Cache expensive HTTP requests with automatic cleanup
- **Function Memoization** - Cache computed function results with memory limits
- **Database Query Caching** - Store frequently accessed query results
- **Image/Asset Caching** - Browser-like cache for loaded resources
- **Session Management** - Keep recent user sessions in memory
- **Configuration Caching** - Cache parsed configuration files
- **Computed Property Caching** - Cache expensive calculations in applications
- **Translation Caching** - Store translated strings with intelligent eviction

**LRU vs Other Caching Strategies:**
- **LRU** - Evicts least recently accessed items (best for general use)
- **FIFO** - Evicts oldest items by insertion time (simpler but less intelligent)
- **LFU** - Evicts least frequently used items (good for stable access patterns)
- **TTL** - Evicts items after time expiration (good for time-sensitive data)

## Array Utilities

### arraySubtract
Subtracts elements of one array from another.
```ts
import { arraySubtract } from '@andranik-arakelyan/js-utilities';

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [1, 3, 5];
const result = arraySubtract(arr1, arr2);
console.log(result); // [2, 4]
```

### arraySplit
Splits an array into chunks based on a separator.
```ts
import { arraySplit } from '@andranik-arakelyan/js-utilities';

// Using a value as separator
const result1 = arraySplit([1, 2, 3, 0, 4, 5, 0, 6], 0);
console.log(result1); // [[1, 2, 3], [4, 5], [6]]

// Using a function as separator
const result2 = arraySplit([1, 2, 3, 4, 5, 6], (item) => item % 2 === 0);
console.log(result2); // [[1], [3], [5]]
```

### shuffle
Randomly shuffles an array using the Fisher-Yates algorithm. This algorithm is superior to naive shuffling approaches (like sorting with a random comparator) because it guarantees a truly random permutation with equal probability for each possible outcome and has optimal O(n) time complexity.
```ts
import { shuffle } from '@andranik-arakelyan/js-utilities';

const array = [1, 2, 3, 4, 5];
const shuffled = shuffle(array);
console.log(shuffled); // Example output: [3, 1, 5, 2, 4]
console.log(array); // Original array remains unchanged: [1, 2, 3, 4, 5]
```

### unique
Returns a new array with duplicate values removed. Optionally accepts a function to determine the key for uniqueness comparison.
```ts
import { unique } from '@andranik-arakelyan/js-utilities';

// Remove duplicates from primitive values
const numbers = [1, 2, 2, 3, 1, 4];
console.log(unique(numbers)); // [1, 2, 3, 4]

// With objects using a custom key selector
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 1, name: 'Alice (duplicate)' }
];
const uniqueUsers = unique(users, user => user.id);
console.log(uniqueUsers); // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
```

### groupBy
Groups array elements by a key selector function. Returns a Map where keys are the result of the key selector function and values are arrays of elements that share the same key.
```ts
import { groupBy } from '@andranik-arakelyan/js-utilities';

// Group numbers by even/odd
const numbers = [1, 2, 3, 4, 5, 6];
const grouped = groupBy(numbers, n => n % 2 === 0 ? 'even' : 'odd');
console.log(grouped); // Map { 'odd' => [1, 3, 5], 'even' => [2, 4, 6] }

// Group objects by property
const users = [
  { name: 'Alice', department: 'Engineering' },
  { name: 'Bob', department: 'Marketing' },
  { name: 'Charlie', department: 'Engineering' }
];
const byDepartment = groupBy(users, user => user.department);
console.log(byDepartment);
// Map { 
//   'Engineering' => [
//     { name: 'Alice', department: 'Engineering' }, 
//     { name: 'Charlie', department: 'Engineering' }
//   ],
//   'Marketing' => [{ name: 'Bob', department: 'Marketing' }]
// }

// Group by multiple criteria using composite keys
const products = [
  { name: 'Laptop', category: 'Electronics', inStock: true },
  { name: 'Phone', category: 'Electronics', inStock: false },
  { name: 'Desk', category: 'Furniture', inStock: true }
];
const byStatus = groupBy(products, p => `${p.category}-${p.inStock}`);
// Groups by category and stock status combined
```

### chunk
Splits an array into chunks of a specified size. The last chunk may contain fewer elements if the array length is not evenly divisible by the chunk size.
```ts
import { chunk } from '@andranik-arakelyan/js-utilities';

// Basic usage with numbers
const numbers = [1, 2, 3, 4, 5, 6];
const chunked = chunk(numbers, 2);
console.log(chunked); // [[1, 2], [3, 4], [5, 6]]

// Handle arrays not evenly divisible
const oddLength = [1, 2, 3, 4, 5];
const chunkedOdd = chunk(oddLength, 2);
console.log(chunkedOdd); // [[1, 2], [3, 4], [5]]

// With objects
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  { id: 4, name: 'Diana' }
];
const userChunks = chunk(users, 2);
console.log(userChunks);
// [
//   [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
//   [{ id: 3, name: 'Charlie' }, { id: 4, name: 'Diana' }]
// ]

// Edge cases
console.log(chunk([], 2)); // []
console.log(chunk([1, 2, 3], 5)); // [[1, 2, 3]]
```

### flatten
Flattens an array to a specified depth, converting nested arrays into a single-level array.
```ts
import { flatten } from '@andranik-arakelyan/js-utilities';

// Flatten one level deep (default)
const nested = [1, [2, 3], [4, [5, 6]]];
const result = flatten(nested);
console.log(result); // [1, 2, 3, 4, [5, 6]]

// Flatten completely (infinite depth)
const deepNested = [1, [2, [3, [4, 5]]]];
const completelyFlat = flatten(deepNested, Infinity);
console.log(completelyFlat); // [1, 2, 3, 4, 5]

// Flatten to specific depth
const mixed = [1, [2, [3, [4, 5]]]];
const flattenTwo = flatten(mixed, 2);
console.log(flattenTwo); // [1, 2, 3, [4, 5]]

// With objects and mixed types
const data = [
  { id: 1 },
  [{ id: 2 }, { id: 3 }],
  [{ id: 4 }, [{ id: 5 }]]
];
const flatObjects = flatten(data);
console.log(flatObjects); 
// [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, [{ id: 5 }]]

// Processing API response data
const apiData = [
  { users: [{id: 1}, {id: 2}] },
  { users: [{id: 3}] }
];
const allUsers = flatten(apiData.map(d => d.users));
console.log(allUsers); // [{id: 1}, {id: 2}, {id: 3}]
```

### intersection
Returns a new array containing elements that are present in both input arrays. Uses Set for efficient lookup, maintaining order from the first array.
```ts
import { intersection } from '@andranik-arakelyan/js-utilities';

// Basic usage with numbers
const arr1 = [1, 2, 3, 4];
const arr2 = [3, 4, 5, 6];
const result = intersection(arr1, arr2);
console.log(result); // [3, 4]

// With strings
const colors1 = ['red', 'blue', 'green'];
const colors2 = ['blue', 'yellow', 'green'];
const common = intersection(colors1, colors2);
console.log(common); // ['blue', 'green']

// Maintains order from the first array
const ordered1 = [4, 1, 3, 2];
const ordered2 = [2, 3, 4, 1];
const orderedResult = intersection(ordered1, ordered2);
console.log(orderedResult); // [4, 1, 3, 2]

// Handles duplicates correctly
const duplicates1 = [1, 2, 2, 3, 3];
const duplicates2 = [2, 3, 4];
const duplicatesResult = intersection(duplicates1, duplicates2);
console.log(duplicatesResult); // [2, 2, 3, 3]

// With objects (by reference)
const obj1 = { id: 1 };
const obj2 = { id: 2 };
const objects1 = [obj1, obj2];
const objects2 = [obj1, { id: 3 }];
const commonObjects = intersection(objects1, objects2);
console.log(commonObjects); // [{ id: 1 }]
```

### difference
Returns a new array containing elements that are in the first array but not in the second array. Uses Set for efficient lookup, maintaining order from the first array.
```ts
import { difference } from '@andranik-arakelyan/js-utilities';

// Basic usage with numbers
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [3, 4];
const result = difference(arr1, arr2);
console.log(result); // [1, 2, 5]

// With strings
const colors1 = ['red', 'blue', 'green', 'yellow'];
const colors2 = ['blue', 'green'];
const remaining = difference(colors1, colors2);
console.log(remaining); // ['red', 'yellow']

// Maintains order from the first array
const ordered1 = [5, 1, 3, 2, 4];
const ordered2 = [2, 4];
const orderedResult = difference(ordered1, ordered2);
console.log(orderedResult); // [5, 1, 3]

// Handles duplicates correctly
const duplicates1 = [1, 2, 2, 3, 3, 4];
const duplicates2 = [2, 4];
const duplicatesResult = difference(duplicates1, duplicates2);
console.log(duplicatesResult); // [1, 3, 3]

// With objects (by reference)
const obj1 = { id: 1 };
const obj2 = { id: 2 };
const obj3 = { id: 3 };
const objects1 = [obj1, obj2, obj3];
const objects2 = [obj2];
const filtered = difference(objects1, objects2);
console.log(filtered); // [{ id: 1 }, { id: 3 }]

// Returns empty array when all elements are excluded
const all = [1, 2, 3];
const excludeAll = [1, 2, 3, 4, 5];
const empty = difference(all, excludeAll);
console.log(empty); // []
```

## Generator Utilities

### range
Generates a sequence of numbers from start to stop (exclusive) with an optional step. This is a JavaScript implementation of Python's range() function using generators. Returns an iterator that yields numbers on demand without creating an array in memory, making it memory-efficient for large ranges.

```ts
import { range } from '@andranik-arakelyan/js-utilities';

// Basic usage - range(stop)
const result1 = [...range(5)];
console.log(result1); // [0, 1, 2, 3, 4]

// With start and stop - range(start, stop)
const result2 = [...range(2, 8)];
console.log(result2); // [2, 3, 4, 5, 6, 7]

// With step - range(start, stop, step)
const result3 = [...range(0, 10, 2)];
console.log(result3); // [0, 2, 4, 6, 8]

// Negative ranges
const result4 = [...range(10, 0, -2)];
console.log(result4); // [10, 8, 6, 4, 2]

// Memory efficient for large ranges - use with for...of loop
for (const i of range(1000000)) {
  if (i > 5) break;
  console.log(i); // 0, 1, 2, 3, 4, 5
}

// Decimal steps are supported
const decimal = [...range(0, 3, 0.5)];
console.log(decimal); // [0, 0.5, 1, 1.5, 2, 2.5]

// Empty ranges when step direction conflicts
console.log([...range(5, 0)]); // [] (positive step with start > stop)
console.log([...range(0, 5, -1)]); // [] (negative step with start < stop)
```

**Key Features:**
- **Memory Efficient** - Uses generators to yield values on demand, no arrays created
- **Python Compatible** - Exact same API and behavior as Python's range()
- **Lazy Evaluation** - Values computed only when needed
- **Decimal Support** - Works with fractional step values
- **Large Range Support** - Can handle very large ranges without memory issues

### rangeIterable
Creates a reusable range iterator that can be iterated over multiple times. Unlike the generator function, this returns an iterable object that doesn't get exhausted after one use.

```ts
import { rangeIterable } from '@andranik-arakelyan/js-utilities';

// Create a reusable range
const r = rangeIterable(0, 5);

// Can be used multiple times
const result1 = [...r]; // [0, 1, 2, 3, 4]
const result2 = [...r]; // [0, 1, 2, 3, 4] - still works!

// Works with multiple iterations
let count1 = 0;
for (const _ of r) count1++;

let count2 = 0;
for (const _ of r) count2++;

console.log(count1, count2); // 5, 5 - both iterations work

// Supports destructuring
const [first, second, ...rest] = rangeIterable(0, 5);
console.log(first, second, rest); // 0, 1, [2, 3, 4]
```

## Object Utilities

### deepClone
Creates a deep clone of an object or array, creating a new copy of all nested objects and arrays. This function handles circular references and various JavaScript built-in types.
```ts
import { deepClone } from '@andranik-arakelyan/js-utilities';

// Simple object cloning
const obj = { a: 1, b: { c: 2 } };
const clone = deepClone(obj);
clone.b.c = 3;
console.log(obj.b.c); // Still 2

// Handling arrays and nested structures
const arr = [1, { x: [2, 3] }];
const cloneArr = deepClone(arr);
cloneArr[1].x[0] = 10;
console.log(arr[1].x[0]); // Still 2

// Handling circular references
const circular = { a: 1 };
circular.self = circular;
const cloneCircular = deepClone(circular);
console.log(cloneCircular.self === cloneCircular); // true

// Handling built-in types
const data = {
  date: new Date(),
  regex: /test/g,
  set: new Set([1, 2, 3]),
  map: new Map([['key', 'value']])
};
const cloneData = deepClone(data);
console.log(cloneData.date instanceof Date); // true
console.log(cloneData.regex instanceof RegExp); // true
console.log(cloneData.set instanceof Set); // true
console.log(cloneData.map instanceof Map); // true
```

### deepMerge
Deep merges one object into another object, optionally at a specific path. This function modifies the target object and provides powerful path-based merging capabilities for nested data structures.

```ts
import { deepMerge } from '@andranik-arakelyan/js-utilities';

// Basic deep merge
const target = { a: 1, b: { c: 2 } };
const source = { b: { d: 3 }, e: 4 };
const result = deepMerge(target, source);
console.log(result); // { a: 1, b: { c: 2, d: 3 }, e: 4 }
console.log(result === target); // true - modifies target object

// Nested object merging
const config = {
  database: { host: 'localhost', port: 5432 },
  cache: { enabled: true }
};
const updates = {
  database: { ssl: true, timeout: 5000 },
  logging: { level: 'info' }
};
deepMerge(config, updates);
// config now contains merged data with all properties preserved and added

// Array replacement (not merging)
const target2 = { items: [1, 2, 3], meta: { count: 3 } };
const source2 = { items: [4, 5], meta: { updated: true } };
deepMerge(target2, source2);
console.log(target2); 
// { items: [4, 5], meta: { count: 3, updated: true } }
// Arrays are replaced, objects are merged

// Path-based merging - merge at specific location
const userData = {
  user: {
    profiles: [
      { id: 1, transactions: { count: 5 } }
    ]
  }
};
const transactionData = { total: 100, recent: ['tx1', 'tx2'] };
deepMerge(userData, transactionData, 'user.profiles.0.transactions');
// Merges transactionData into userData.user.profiles[0].transactions

// Complex path with arrays and objects
const app = { 
  modules: [
    { name: 'auth', config: { providers: ['google'] } }
  ] 
};
const newProviders = { providers: ['google', 'facebook'], timeout: 5000 };
deepMerge(app, newProviders, 'modules.0.config');
// app.modules[0].config now has both old and new providers plus timeout

// Creating missing nested structures
const emptyTarget = { api: {} };
const nestedData = { secret: 'abc123', expiry: 3600 };
deepMerge(emptyTarget, nestedData, 'api.auth.jwt');
// Creates api.auth.jwt object and merges nestedData into it

// Working with user profiles and settings
const user = {
  profile: { name: 'John', preferences: { theme: 'dark' } },
  activity: { lastLogin: '2025-01-01' }
};
const profileUpdates = { age: 30, preferences: { notifications: true } };
deepMerge(user, profileUpdates, 'profile');
// user.profile now has name, age, and merged preferences

// Database configuration merging
const dbConfig = {
  connections: {
    primary: { host: 'localhost', port: 5432 },
    replica: { host: 'replica.local', port: 5432 }
  }
};
const sslConfig = { ssl: true, sslCert: '/path/to/cert' };
deepMerge(dbConfig, sslConfig, 'connections.primary');
// Adds SSL configuration to primary database connection
```

**Key Features:**
- **Deep Merging** - Recursively merges nested objects while preserving existing properties
- **Path-Based Merging** - Merge data at specific locations using dot notation paths (e.g., 'user.profile.settings')
- **Array Index Support** - Navigate through arrays using numeric indices in paths (e.g., 'users.0.profile')
- **Target Modification** - Modifies and returns the target object (not immutable)
- **Array Replacement** - Arrays are completely replaced rather than merged element-wise
- **Type Preservation** - Maintains object types including Date, RegExp, and other built-in types
- **Path Creation** - Automatically creates missing intermediate objects in the path
- **Error Handling** - Provides clear error messages for invalid paths and type mismatches

**Use Cases:**
- **Configuration Management** - Merge environment-specific settings into base configuration
- **User Profile Updates** - Update specific sections of complex user data structures
- **API Response Merging** - Combine partial API responses into complete data objects
- **State Management** - Update specific parts of application state in Redux/similar patterns
- **Database Updates** - Merge partial updates into existing database records
- **Settings Management** - Update nested application settings without losing existing preferences
- **Theme Customization** - Merge custom theme properties into base themes at specific paths
- **Plugin Configuration** - Merge plugin settings into specific configuration sections
- **Form Data Processing** - Merge form updates into complex nested data structures
- **Migration Scripts** - Selectively update parts of data structures during migrations

**Path Syntax:**
- Use dot notation to navigate object properties: `'user.profile.settings'`
- Use numeric indices for arrays: `'users.0.profile'` or `'items.2.metadata'`
- Mix objects and arrays: `'config.databases.0.connection.ssl'`
- Create missing paths: If intermediate objects don't exist, they will be created

**Array Handling:**
Unlike object properties which are merged deeply, arrays are completely replaced by the source array. This design choice ensures predictable behavior and avoids complex array merging logic.

```ts
// Example of array replacement behavior
const target = { tags: ['old1', 'old2'], info: { version: 1 } };
const source = { tags: ['new1'], info: { author: 'John' } };
deepMerge(target, source);
// Result: { tags: ['new1'], info: { version: 1, author: 'John' } }
```

### jsonCompare
Compares a base JSON object with multiple other JSON objects and returns structured differences. This function performs deep comparison and identifies missing keys, extra keys, and type mismatches between objects.

```ts
import { jsonCompare } from '@andranik-arakelyan/js-utilities';

// Basic comparison
const base = {
  name: "John",
  age: 30,
  address: {
    city: "NYC",
    zip: "10001"
  }
};

const obj1 = {
  name: "John",
  address: { city: "NYC" }
}; // missing 'age' and 'address.zip'

const obj2 = {
  name: "John",
  age: "30", // type mismatch: string instead of number
  address: { city: "NYC", zip: "10001" },
  email: "john@example.com" // extra key
};

const differences = jsonCompare(base, [obj1, obj2]);
console.log(differences);
// [
//   { objectIndex: 0, diffType: 'missing_key', keyPath: 'age', baseValueType: 'number' },
//   { objectIndex: 0, diffType: 'missing_key', keyPath: 'address.zip', baseValueType: 'string' },
//   { objectIndex: 1, diffType: 'type_mismatch', keyPath: 'age', baseValueType: 'number', comparedValueType: 'string' },
//   { objectIndex: 1, diffType: 'extra_key', keyPath: 'email', comparedValueType: 'string' }
// ]

// Programmatically handle differences
differences.forEach(diff => {
  switch (diff.diffType) {
    case 'missing_key':
      console.log(`Object ${diff.objectIndex} is missing key: ${diff.keyPath}`);
      break;
    case 'extra_key':
      console.log(`Object ${diff.objectIndex} has extra key: ${diff.keyPath}`);
      break;
    case 'type_mismatch':
      console.log(`Object ${diff.objectIndex} has type mismatch at ${diff.keyPath}: expected ${diff.baseValueType}, got ${diff.comparedValueType}`);
      break;
  }
});

// Complex nested structures
const config = {
  app: {
    name: "MyApp",
    features: {
      auth: {
        enabled: true,
        providers: ["google", "facebook"]
      },
      notifications: {
        email: true,
        push: false
      }
    }
  }
};

const incompleteConfig = {
  app: {
    name: "MyApp",
    features: {
      auth: {
        enabled: true
        // missing 'providers'
      }
      // missing 'notifications' entirely
    }
  }
};

const configDiffs = jsonCompare(config, [incompleteConfig]);
// Identifies missing nested keys and structures
```

**Use Cases:**
- **Configuration Validation** - Compare expected config structure with actual config
- **API Response Validation** - Ensure API responses contain all required fields
- **Data Migration** - Identify missing or changed fields during data transformations
- **Translation File Auditing** - Find missing translation keys across different language files
- **Schema Validation** - Verify data objects conform to expected schemas
- **Testing** - Compare expected vs actual object structures in tests

**Difference Types:**
- `missing_key` - Key exists in base but not in compared object
- `extra_key` - Key exists in compared object but not in base  
- `type_mismatch` - Key exists in both but values have different types

**Type Detection:**
- Distinguishes between `array`, `object`, `string`, `number`, `boolean`, `null`, and `undefined`
- Uses dot notation for nested key paths (`user.profile.address.city`)
- Handles deeply nested structures recursively

### flattenObject
Converts a nested object into a flat object with dot notation keys. This is useful for storing nested data in systems that don't support nested structures (like some databases), or for easier manipulation and comparison of deeply nested objects.

```ts
import { flattenObject } from '@andranik-arakelyan/js-utilities';

// Basic usage with nested objects
const nested = {
  user: {
    profile: {
      name: 'John',
      age: 30
    },
    settings: {
      theme: 'dark',
      notifications: {
        email: true,
        push: false
      }
    }
  },
  app: {
    version: '1.0.0'
  }
};

const flattened = flattenObject(nested);
console.log(flattened);
// {
//   'user.profile.name': 'John',
//   'user.profile.age': 30,
//   'user.settings.theme': 'dark',
//   'user.settings.notifications.email': true,
//   'user.settings.notifications.push': false,
//   'app.version': '1.0.0'
// }

// Handles arrays as primitive values
const withArrays = {
  items: [1, 2, 3],
  config: {
    tags: ['frontend', 'backend'],
    options: {
      features: ['auth', 'api']
    }
  }
};

const flattenedArrays = flattenObject(withArrays);
console.log(flattenedArrays);
// {
//   'items': [1, 2, 3],
//   'config.tags': ['frontend', 'backend'],
//   'config.options.features': ['auth', 'api']
// }

// Preserves special objects (Date, RegExp, etc.)
const withSpecialTypes = {
  created: new Date('2025-01-01'),
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    timestamps: {
      updated: new Date('2025-08-12')
    }
  }
};

const flattenedSpecial = flattenObject(withSpecialTypes);
// Date and RegExp objects are preserved as-is in the flattened structure

// Configuration file processing
const config = {
  database: {
    connection: {
      host: 'localhost',
      port: 5432,
      ssl: {
        enabled: true,
        cert: '/path/to/cert'
      }
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  cache: {
    redis: {
      url: 'redis://localhost:6379',
      options: {
        maxRetries: 3,
        timeout: 5000
      }
    }
  }
};

const flatConfig = flattenObject(config);
// Perfect for environment variable mapping:
// 'database.connection.host' -> DATABASE_CONNECTION_HOST
// 'database.connection.port' -> DATABASE_CONNECTION_PORT
// 'cache.redis.options.timeout' -> CACHE_REDIS_OPTIONS_TIMEOUT
```

### unflattenObject
Converts a flat object with dot notation keys back into a nested object structure. This is the inverse operation of `flattenObject` and is useful for reconstructing nested data from flat storage formats.

```ts
import { unflattenObject } from '@andranik-arakelyan/js-utilities';

// Basic usage - reverse of flattenObject
const flattened = {
  'user.profile.name': 'John',
  'user.profile.age': 30,
  'user.settings.theme': 'dark',
  'user.settings.notifications.email': true,
  'user.settings.notifications.push': false,
  'app.version': '1.0.0'
};

const nested = unflattenObject(flattened);
console.log(nested);
// {
//   user: {
//     profile: {
//       name: 'John',
//       age: 30
//     },
//     settings: {
//       theme: 'dark',
//       notifications: {
//         email: true,
//         push: false
//       }
//     }
//   },
//   app: {
//     version: '1.0.0'
//   }
// }

// Perfect roundtrip with flattenObject
const original = {
  api: {
    endpoints: {
      users: '/api/users',
      posts: '/api/posts'
    },
    auth: {
      jwt: {
        secret: 'secret-key',
        expiry: 3600
      }
    }
  }
};

const flattened2 = flattenObject(original);
const reconstructed = unflattenObject(flattened2);
console.log(JSON.stringify(original) === JSON.stringify(reconstructed)); // true

// Environment variable reconstruction
const envVars = {
  'DATABASE_HOST': 'localhost',
  'DATABASE_PORT': '5432',
  'DATABASE_NAME': 'myapp',
  'CACHE_REDIS_URL': 'redis://localhost:6379',
  'CACHE_REDIS_TIMEOUT': '5000',
  'API_JWT_SECRET': 'secret-key',
  'API_JWT_EXPIRY': '3600'
};

// Convert environment variables to nested config
const dotNotationConfig = {};
Object.entries(envVars).forEach(([key, value]) => {
  const dotKey = key.toLowerCase().replace(/_/g, '.');
  dotNotationConfig[dotKey] = value;
});

const nestedConfig = unflattenObject(dotNotationConfig);
console.log(nestedConfig);
// {
//   database: {
//     host: 'localhost',
//     port: '5432',
//     name: 'myapp'
//   },
//   cache: {
//     redis: {
//       url: 'redis://localhost:6379',
//       timeout: '5000'
//     }
//   },
//   api: {
//     jwt: {
//       secret: 'secret-key',
//       expiry: '3600'
//     }
//   }
// }

// Form data processing
const formData = {
  'personal.firstName': 'John',
  'personal.lastName': 'Doe',
  'personal.email': 'john@example.com',
  'address.street': '123 Main St',
  'address.city': 'New York',
  'address.zip': '10001',
  'preferences.newsletter': true,
  'preferences.theme': 'dark'
};

const structuredData = unflattenObject(formData);
// Perfect for sending to APIs that expect nested objects
```

**Common Use Cases:**

**flattenObject:**
- **Environment Variable Mapping** - Convert nested config to flat environment variables
- **Database Storage** - Store nested data in key-value databases 
- **Form Serialization** - Convert nested form data to flat query parameters
- **Configuration Management** - Flatten config for easier processing
- **CSV Export** - Convert nested JSON to flat structure for CSV generation
- **Search Indexing** - Flatten documents for full-text search engines

**unflattenObject:**
- **Environment Variable Loading** - Reconstruct nested config from environment variables
- **API Response Processing** - Convert flat API responses back to nested structures
- **Form Data Reconstruction** - Rebuild nested objects from form submissions
- **Configuration Loading** - Load flat configuration files into nested structures
- **Database Deserialization** - Convert flat database records back to nested objects
- **Message Queue Processing** - Reconstruct objects from flattened message payloads

**Key Features:**
- **Type Preservation** - Maintains all primitive types, arrays, dates, regexes, etc.
- **Perfect Roundtrip** - `unflattenObject(flattenObject(obj))` returns the original object
- **Null/Undefined Safe** - Properly handles null and undefined values
- **Empty Object Handling** - Efficiently handles empty nested objects
- **Performance Optimized** - Efficient algorithms for both flattening and unflattening operations

## Random Utilities

### randomInt
Generates a random integer in a specified range.
```ts
import { randomInt } from '@andranik-arakelyan/js-utilities';

// Random number between 1 and 10
const random = randomInt(10, 1);
console.log(random); // Example output: 7
```

### randomBoolean
Generates a random boolean value.
```ts
import { randomBoolean } from '@andranik-arakelyan/js-utilities';

const random = randomBoolean();
console.log(random); // Either true or false
```

## Runtime Utilities

### currentCodeInfo
Returns information about the current code execution context.
```ts
import { currentCodeInfo } from '@andranik-arakelyan/js-utilities';

function exampleFunction() {
  const info = currentCodeInfo();
  console.log(info);
  // Output: 
  // {
  //   className: "",
  //   methodName: "exampleFunction",
  //   filepath: "/path/to/your/file.js",
  //   filename: "file.js",
  //   lineNumber: 4,
  //   columnNumber: 15
  // }
}

exampleFunction();
```

## Function Utilities

### once
Creates a function that ensures the original function is only ever called once, regardless of how many times the returned function is called. Subsequent calls to the wrapped function return the result of the first invocation.

```ts
import { once } from '@andranik-arakelyan/js-utilities';

// Create a function that will only execute once
const initializeApp = once(() => {
  console.log('App initialized!');
  return 'Initialization complete';
});

// First call - function executes
const result1 = initializeApp(); // Logs: 'App initialized!'

// Subsequent calls - function is not executed again
const result2 = initializeApp(); // No log output

// Both calls return the same result
console.log(result1 === result2); // true

// Works with parameters and preserves this context
const obj = {
  data: 'example',
  process: once(function(this: { data: string }, prefix: string) {
    console.log(`Processing ${prefix} ${this.data}`);
    return `${prefix}-${this.data}`;
  })
};

// First call with parameters
obj.process('test'); // Logs: 'Processing test example', returns: 'test-example'

// Second call - function is not executed again even with different parameters
obj.process('another'); // No log output, still returns: 'test-example'
```

### debounce
Creates a debounced function that delays invoking the provided function until after the specified wait time has elapsed since the last time it was invoked. The function will only execute once the wait period has elapsed with no new calls. This is particularly useful when dealing with events that fire rapidly, such as window resizing, scrolling, or keystrokes, when you want to execute the handler only after the user has stopped the action.

```ts
import { debounce } from '@andranik-arakelyan/js-utilities';

// Create a debounced version of a function
const handleInput = debounce((value) => {
  // This will only execute after the user has stopped typing for 300ms
  console.log('Processing input:', value);
  performSearch(value);
}, 300);

// Attach to an input event
inputElement.addEventListener('input', e => handleInput(e.target.value));

// Multiple rapid calls reset the timer each time
handleInput('a'); // Starts the timer
handleInput('ab'); // Cancels previous timer, starts a new one
handleInput('abc'); // Cancels previous timer, starts a new one
// After 300ms of no calls, the function executes with 'abc'

// With proper TypeScript typing
const calculateLayout = debounce((width: number, height: number): string => {
  // Expensive calculation that should not run on every resize event
  return `${width}x${height}`;
}, 100);

// Cancel a pending debounced call if needed
handleInput.cancel();
```

### throttle
Creates a throttled function that only invokes the provided function at most once per every specified wait milliseconds, regardless of how many times it's called. This is useful when you want to limit the rate at which a function is executed, such as during scroll events or continuous button clicks.

```ts
import { throttle } from '@andranik-arakelyan/js-utilities';

// Create a throttled version of a function
const handleScroll = throttle(() => {
  // This will execute at most once every 300ms, even if scrolling continuously
  console.log('Processing scroll event');
}, 300);

// Attach to a scroll event
window.addEventListener('scroll', handleScroll);

// With proper TypeScript typing
const updatePosition = throttle((x: number, y: number): string => {
  // Update UI based on position, but not too frequently
  return `${x},${y}`;
}, 100);

// Cancel a pending throttled call if needed
handleScroll.cancel();
```

## Promise Utilities

### wait
Creates a promise that resolves after a specified delay.
```ts
import { wait } from '@andranik-arakelyan/js-utilities';

// Wait for 1 second
await wait(1000);

// Chain with other operations
wait(500).then(() => console.log('Half a second has passed'));

// Use in an async function
async function delayedOperation() {
  console.log('Starting');
  await wait(2000);
  console.log('2 seconds have passed');
}
```

### retry
Retries an async function with configurable attempts and exponential backoff.
```ts
import { retry } from '@andranik-arakelyan/js-utilities';

// Basic usage with default options (3 attempts)
const data = await retry(() => fetchData());

// With custom retry configuration
const result = await retry(
  () => riskyOperation(),
  { 
    attempts: 5,              // Maximum attempts including initial attempt
    delay: 1000,              // Initial delay in milliseconds
    backoffFactor: 2,         // Multiply delay by this factor after each attempt
    retryIf: (err) => err instanceof NetworkError,  // Only retry specific errors
    onRetry: (err, attempt) => console.log(`Retry attempt ${attempt}`) // Track retries
  }
);
```

### safeAsync
Wraps an async function to handle errors gracefully without throwing exceptions. Returns a standardized result object instead of throwing errors, making error handling explicit and preventing unhandled promise rejections.
```ts
import { safeAsync } from '@andranik-arakelyan/js-utilities';

// Basic usage with API call
const result = await safeAsync(() => fetchUserData(userId));
if (result.success) {
  console.log('User data:', result.data);
} else {
  console.error('Failed to fetch user:', result.error.message);
}

// With file operations that might fail
const fileResult = await safeAsync(() => fs.readFile('config.json', 'utf8'));
if (fileResult.success) {
  const config = JSON.parse(fileResult.data);
  // Process config...
} else {
  console.error('File read failed:', fileResult.error);
  // Handle error gracefully...
}

// No try/catch blocks needed - errors are values
const apiResults = await Promise.all([
  safeAsync(() => fetchUsers()),
  safeAsync(() => fetchPosts()),
  safeAsync(() => fetchComments())
]);

apiResults.forEach((result, index) => {
  if (result.success) {
    console.log(`API ${index} succeeded:`, result.data);
  } else {
    console.log(`API ${index} failed:`, result.error.message);
  }
});
```

### PromisePool
A concurrency control utility that manages the execution of async functions with a maximum concurrency limit. Functions are queued and executed in batches, ensuring no more than the specified number run simultaneously.

```ts
import { PromisePool } from '@andranik-arakelyan/js-utilities';

// Create a pool with max 3 concurrent operations
const pool = new PromisePool(3);

// Execute async functions through the pool
const results = await Promise.all([
  pool.execute(() => fetchUser(1)),
  pool.execute(() => fetchUser(2)),
  pool.execute(() => fetchUser(3)),
  pool.execute(() => fetchUser(4)),  // Will be queued
  pool.execute(() => fetchUser(5))   // Will be queued
]);

// API rate limiting example
const apiPool = new PromisePool(5); // Max 5 concurrent API calls

const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const users = await Promise.all(
  userIds.map(id => 
    apiPool.execute(() => fetch(`/api/users/${id}`).then(r => r.json()))
  )
);

// File processing with limited resources
const filePool = new PromisePool(2);

const filePaths = ['file1.txt', 'file2.txt', 'file3.txt'];
const fileContents = await Promise.all(
  filePaths.map(path =>
    filePool.execute(() => fs.readFile(path, 'utf8'))
  )
);

// Monitor pool status
console.log(pool.runningCount);   // Current running tasks
console.log(pool.queuedCount);    // Current queued tasks  
console.log(pool.isAtCapacity);   // Whether pool is at max capacity
console.log(pool.maxConcurrency); // Pool's concurrency limit
```

## Network Utilities

### BaseApiClient
An abstract base class for creating HTTP API clients with built-in header management, error handling, and request management. Uses axios under the hood to ensure cross-platform compatibility (works in both Node.js and browser environments).

Headers are managed directly in the client instance for better reliability and explicit control. This ensures headers are consistently sent with every request.

```ts
import { BaseApiClient, BaseApiClientConfig } from '@andranik-arakelyan/js-utilities';

// Create a concrete API client by extending BaseApiClient
class MyApiClient extends BaseApiClient {
  constructor(config: BaseApiClientConfig) {
    super(config);
  }

  // Define your API methods
  async getUser(userId: number) {
    return this.request<User>({
      path: `/users/${userId}`,
      method: 'GET'
    });
  }

  async createUser(userData: CreateUserData) {
    return this.request<User>({
      path: '/users',
      method: 'POST',
      body: userData
    });
  }

  async searchUsers(query: string, page: number = 1, limit: number = 10) {
    return this.request<UserSearchResults>({
      path: '/users/search',
      method: 'GET',
      query: { q: query, page, limit }
    });
  }
}

// Initialize the client with configuration
const apiClient = new MyApiClient({
  baseUrl: 'https://api.example.com',
  urlPrefix: '/v1'  // Optional: adds /v1 to all requests
});

// Set custom headers (includes default Content-Type: application/json)
apiClient.setHeaders({
  'Authorization': 'Bearer your-token-here',
  'X-Request-ID': 'unique-request-id-123'
});

// Use the client
try {
  const user = await apiClient.getUser(123);
  console.log('User:', user);

  const results = await apiClient.searchUsers('john', 1, 20);
  console.log('Search results:', results);
} catch (error) {
  console.error('API error:', error.message);
}

// Dynamic header management
// Get current headers
const currentHeaders = apiClient.getHeaders();
console.log('Current headers:', currentHeaders);
// Output: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ...', ... }

// Update specific header
apiClient.setHeaders({
  'Authorization': 'Bearer new-refreshed-token'
});

// Delete a header by setting it to null
apiClient.setHeaders({
  'X-Request-ID': null  // Removes the X-Request-ID header
});

// Header lifecycle example (login/logout flow)
class AuthenticatedApiClient extends BaseApiClient {
  async login(username: string, password: string) {
    // Clear any existing Authorization header first
    this.setHeaders({ 'Authorization': null });
    
    const response = await this.request<{ token: string }>({
      path: '/auth/login',
      method: 'POST',
      body: { username, password }
    });
    
    // Set the new Authorization header for subsequent requests
    this.setHeaders({ 'Authorization': `Bearer ${response.token}` });
    
    return response;
  }
  
  async logout() {
    await this.request({
      path: '/auth/logout',
      method: 'POST'
    });
    
    // Clear the Authorization header after logout
    this.setHeaders({ 'Authorization': null });
  }
  
  async refreshToken(refreshToken: string) {
    const response = await this.request<{ token: string }>({
      path: '/auth/refresh',
      method: 'POST',
      body: { refreshToken }
    });
    
    // Update the Authorization header without creating a new client instance
    this.setHeaders({ 'Authorization': `Bearer ${response.token}` });
    
    return response;
  }
  
  // Add custom headers for specific use cases
  async setRequestID(requestId: string) {
    this.setHeaders({ 'X-Request-ID': requestId });
  }
}

// Integration with other utilities
import { retry, safeAsync, PromisePool } from '@andranik-arakelyan/js-utilities';

// Retry failed requests
const userWithRetry = await retry(
  () => apiClient.getUser(123),
  { attempts: 3, delay: 1000 }
);

// Rate limiting with PromisePool
const pool = new PromisePool(5);
const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const users = await Promise.all(
  userIds.map(id => pool.execute(() => apiClient.getUser(id)))
);
```

**Error Handling with Response Data:**
When the API throws an error, the complete server response is bound to the Error instance via the `response` property, allowing access to structured error data:

```ts
try {
  await apiClient.createUser({ name: 'John' });
} catch (error: any) {
  console.log(error.message);           // 'Validation Error'
  console.log(error.response.code);     // 'VALIDATION_ERROR'
  console.log(error.response.errors);   // [{ field: 'email', message: 'Email required' }]
  
  // Use error details for recovery strategies
  if (error.response?.code === 'AUTH_FAILED') {
    // Handle authentication failure
    await apiClient.refreshToken();
  }
}
```

**Key Features:**
- **Axios-Based** - Uses axios for reliable HTTP requests in both Node.js and browsers
- **Cross-Platform** - Works seamlessly in Node.js and browser environments
- **Type-Safe** - Full TypeScript generic support for request/response types
- **Reliable Header Management** - Headers stored in client instance for consistent delivery with every request
- **Dynamic Header Updates** - Update, add, or remove headers without recreating the client instance
- **Error Handling** - Centralized error handling with customizable error messages
- **Query Parameters** - Automatic serialization of query parameters
- **Request Body** - Automatic JSON serialization of request bodies
- **Default Headers** - Automatically includes Content-Type: application/json

**Configuration Options:**
- `baseUrl` - The base URL of the API (e.g., 'https://api.example.com')
- `urlPrefix` - Optional prefix for all endpoints (e.g., '/v1', '/api')

**Header Management Methods:**
- `setHeaders(headers: Record<string, string | null>)` - Sets or updates headers. Pass `null` to delete a header. Changes apply to all subsequent requests.
- `getHeaders()` - Returns a copy of all current headers including defaults

**Supported HTTP Methods:**
GET, POST, PUT, PATCH, DELETE

**Use Cases:**
- **REST API Clients** - Build type-safe clients for any REST API
- **Microservices** - Communicate between services with consistent error handling
- **Third-Party APIs** - Integrate with external APIs (GitHub, Stripe, etc.)
- **SDK Development** - Build SDKs for your API with TypeScript support
- **Authentication Flows** - Handle login/logout and token refresh scenarios
- **Custom Headers** - Add any HTTP headers needed (request IDs, API keys, custom authentication, etc.)
- **Dynamic Configuration** - Update headers and authentication without recreating client instances
- **Token Rotation** - Seamlessly update bearer tokens or API keys during runtime

