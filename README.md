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
  - [Array Utilities](#array-utilities)
    - [arraySubtract](#arraysubtract)
    - [arraySplit](#arraysplit)
    - [shuffle](#shuffle)
    - [unique](#unique)
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

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## Links
[NPM page](https://www.npmjs.com/package/@andranik-arakelyan/js-utilities)

[Git repository](https://github.com/andranikarakelyan/js-utilities)

## License
This project is licensed under the MIT License - see the LICENSE file for details.
