# js-utilities

[![npm version](https://badge.fury.io/js/js-utilities.svg)](https://badge.fury.io/js/js-utilities)
[![Build Status](https://travis-ci.com/andranik-a/js-utilities.svg?branch=main)](https://travis-ci.com/andranik-a/js-utilities)
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

```js
const { arraySubtract } = require('@andranik-arakelyan/js-utilities');

const result = arraySubtract([1, 3, 5] , [ 1, 2, 3]);
console.log( 'result', result ); // [5]
```


## Features
- arraySubtract
- randomInt
- randomBoolean

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.

## Links
[NPM page](https://www.npmjs.com/package/@andranik-arakelyan/js-utilities)

[Git repository](https://github.com/andranikarakelyan/js-utilities)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
