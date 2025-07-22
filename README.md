# js-utilities

[![npm version](https://badge.fury.io/js/js-utilities.svg)](https://badge.fury.io/js/js-utilities)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Utility functions for all JavaScript/TypeScript environments.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
  - [Data Structures](#data-structures)
    - [Stack](#stackt)
    - [Queue](#queuet)
    - [CircularBuffer](#circularbuffert)
  - [Array Utilities](#array-utilities)
    - [arraySubtract](#arraysubtract)
    - [arraySplit](#arraysplit)
    - [shuffle](#shuffle)
    - [unique](#unique)
    - [groupBy](#groupby)
    - [chunk](#chunk)
    - [flatten](#flatten)
    - [intersection](#intersection)
    - [difference](#difference)
  - [Generator Utilities](#generator-utilities)
    - [range](#range)
    - [rangeIterable](#rangeiterable)
  - [Object Utilities](#object-utilities)
    - [deepClone](#deepclone)
  - [Random Utilities](#random-utilities)
    - [randomInt](#randomint)
    - [randomBoolean](#randomboolean)
  - [Runtime Utilities](#runtime-utilities)
    - [currentCodeInfo](#currentcodeinfo)
  - [Function Utilities](#function-utilities)
    - [once](#once)
    - [debounce](#debounce)
    - [throttle](#throttle)
  - [Promise Utilities](#promise-utilities)
    - [wait](#wait)
    - [retry](#retry)
    - [safeAsync](#safeasync)
- [Contributing](#contributing)
- [Links](#links)
- [License](#license)

## Installation
To install the package, use npm:
```sh
npm install @andranik-arakelyan/js-utilities
```

## Usage
Import the utilities you need in your project:
```ts
import {arraySubtract} from '@andranik-arakelyan/js-utilities';

const result = arraySubtract([1, 3, 5] , [ 1, 2, 3]);
console.log( 'result', result ); // [5]
```

## Features

### Data Structures

#### Stack<T>
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

#### Queue<T>
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

#### CircularBuffer<T>
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

### Array Utilities

#### arraySubtract
Subtracts elements of one array from another.
```ts
import { arraySubtract } from '@andranik-arakelyan/js-utilities';

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [1, 3, 5];
const result = arraySubtract(arr1, arr2);
console.log(result); // [2, 4]
```

#### arraySplit
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

#### shuffle
Randomly shuffles an array using the Fisher-Yates algorithm. This algorithm is superior to naive shuffling approaches (like sorting with a random comparator) because it guarantees a truly random permutation with equal probability for each possible outcome and has optimal O(n) time complexity.
```ts
import { shuffle } from '@andranik-arakelyan/js-utilities';

const array = [1, 2, 3, 4, 5];
const shuffled = shuffle(array);
console.log(shuffled); // Example output: [3, 1, 5, 2, 4]
console.log(array); // Original array remains unchanged: [1, 2, 3, 4, 5]
```

#### unique
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

#### groupBy
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

#### chunk
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

#### flatten
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

#### intersection
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

#### difference
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

### Generator Utilities

#### range
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

#### rangeIterable
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

### Object Utilities

#### deepClone
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

### Random Utilities

#### randomInt
Generates a random integer in a specified range.
```ts
import { randomInt } from '@andranik-arakelyan/js-utilities';

// Random number between 1 and 10
const random = randomInt(10, 1);
console.log(random); // Example output: 7
```

#### randomBoolean
Generates a random boolean value.
```ts
import { randomBoolean } from '@andranik-arakelyan/js-utilities';

const random = randomBoolean();
console.log(random); // Either true or false
```

### Runtime Utilities

#### currentCodeInfo
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

### Function Utilities

#### once
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

#### debounce
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

#### throttle
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

### Promise Utilities

#### wait
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

#### retry
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

#### safeAsync
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

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## Links
[NPM page](https://www.npmjs.com/package/@andranik-arakelyan/js-utilities)

[Git repository](https://github.com/andranikarakelyan/js-utilities)

## License
This project is licensed under the MIT License - see the LICENSE file for details.
