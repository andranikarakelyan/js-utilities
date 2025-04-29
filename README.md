# js-utilities

[![npm version](https://badge.fury.io/js/js-utilities.svg)](https://badge.fury.io/js/js-utilities)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Utility functions for all JavaScript/TypeScript environments.

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
