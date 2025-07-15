# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [Unreleased]

## [0.14.0] - 2025-07-15

### Added

- New array utility functions:
  - `intersection` function to find common elements between two arrays
  - `difference` function to find elements in first array but not in second
  - Both functions use Set for efficient lookup and maintain order from first array
  - Support for generic types and handle duplicates correctly
  - Comprehensive test suites with edge cases and type safety
  - Updated README with detailed documentation and usage examples

## [0.13.0] - 2025-07-08

### Added

- New data structure:
  - `CircularBuffer<T>` class - Fixed-size circular buffer (ring buffer) implementation
  - Automatically overwrites oldest elements when buffer is full and new elements are added
  - Generic type support for any data type (numbers, strings, objects, etc.)
  - Complete API with `push()`, `shift()`, `get()`, `peek()`, `peekOldest()` methods
  - Utility methods: `size()`, `capacity()`, `isFull()`, `isEmpty()`, `clear()`, `toArray()`
  - Iterator support for `for...of` loops and `Array.from()`
  - Handles buffer wrapping and maintains element order from oldest to newest
  - Comprehensive test suite with 29 test cases covering all functionality and edge cases
  - Perfect for implementing sliding windows, recent activity logs, rolling metrics, and undo systems
  - Updated README with detailed documentation and practical usage examples

## [0.12.0] - 2025-07-01

### Added

- New array utility function:
  - `flatten` function to flatten nested arrays to a specified depth
  - Supports configurable depth parameter (default: 1 level)
  - Handles infinite depth flattening with `Infinity` parameter
  - Provides input validation with descriptive error messages
  - Maintains immutability by returning new arrays
  - Comprehensive test suite covering various depth scenarios and edge cases

## [0.11.0] - 2025-06-24

### Added

- New promise utility function:
  - `safeAsync` function for graceful async error handling
  - Returns standardized result object instead of throwing exceptions
  - Provides type-safe error handling with `SafeAsyncResult<T>` type
  - Includes comprehensive test suite with 8 test cases covering various scenarios
  - Follows existing code style and patterns

## [0.10.0] - 2025-06-17

### Added

- New array utility function:
  - `chunk` function to split arrays into chunks of specified size
  - Handles arrays of any type with full TypeScript support
  - Supports edge cases like empty arrays and chunk sizes larger than array length
  - Input validation with descriptive error messages
  - Maintains immutability by returning new arrays
  - Comprehensive test suite with edge cases and type safety validation

## [0.9.0] - 2025-06-10

### Added

- New array utility function:
  - `groupBy` function to group array elements by a key selector function
  - Returns a Map where keys are the result of the key selector function and values are arrays of grouped elements
  - Supports primitive values and complex object grouping with type safety
  - Handles empty arrays gracefully
  - Comprehensive test suite with edge cases and multiple usage examples

## [0.8.0] - 2025-06-03

### Added

- New object utility function:
  - `deepClone` function for creating deep copies of objects and arrays
  - Handles circular references and various JavaScript built-in types
  - Preserves type information for Date, RegExp, Set, and Map objects

## [0.7.0] - 2025-05-27

### Added

- New array utility function:
  - `unique` function to remove duplicate values from arrays
  - Supports custom key selectors for complex objects
  - Preserves original object references

## [0.6.0] - 2025-05-20

### Added

- New `function` utilities module enriched with several functions:
  - `throttle` function to limit how often a function can be called
  - `debounce` function to delay function execution until after a cooldown period
  - `once` function to ensure a function is only executed a single time

### Changed

- Removed AI_SUGGESTED_FEATURES.md file from the project

## [0.5.0] - 2025-05-13

### Added

- `Stack<T>` and `Queue<T>` data structures in data-structures module
  - Type-safe generic implementations for Stack and Queue
  - Stack provides LIFO (Last-In-First-Out) operations
  - Queue provides FIFO (First-In-First-Out) operations
  - Comprehensive test suite validating correct behavior

## [0.4.0] - 2025-05-06

### Added

- `shuffle` function in Array utilities module for randomly reordering array elements
  - Implements the Fisher-Yates (Knuth) shuffle algorithm
  - Offers efficient in-place shuffling with O(n) time complexity
  - Returns a new shuffled array without modifying the original
  - Fully tested with Jest for randomness and distribution

### Changed

- Added PUBLISHING.md documentation with guidelines for release process
- Updated .npmignore configuration for better package management
- Added AI_SUGGESTED_FEATURES.md with potential future development ideas

## [0.3.0] - 2025-04-29

### Added

- `retry` function in Promise utilities module for retrying async operations
  - Supports configurable number of attempts, delay, and exponential backoff
  - Provides conditional retry logic through the `retryIf` option
  - Includes callback for monitoring retry attempts with `onRetry`
  - Handles and preserves original error context

## [0.2.2] - 2025-05-10

### Changed

- Reduced npm package size significantly:
  - Enhanced `.npmignore` configuration to exclude development artifacts
  - Implemented JavaScript minification for production builds
  - Optimized bundle structure for faster downloads and installations
  - Removed source maps and unnecessary files from published package

## [0.2.1] - 2025-04-22

### Added

- `wait` function in Promise utilities module that creates a promise resolving after a specified delay
  - Provides a simple way to introduce delays in async code
  - Fully tested with Jest for accurate timing behavior
  - Handles edge cases like zero and negative values appropriately

## [0.1.0] - 2025-04-08

### Added

- `arraySplit` function for dividing arrays into chunks based on separators
  - Supports both value-based separation and predicate function criteria
  - Returns multi-dimensional array containing the split chunks
  - Preserves original element order within chunks

## [0.0.2] - 2025-03-22

### Added

- `currentCodeInfo` function for obtaining runtime code execution details
  - Returns class name, method name, file path and position information
  - Supports class methods, named functions and anonymous functions
  - Useful for logging, debugging and error reporting

## [0.0.1] - 2025-03-02

### Added

- Initial release with core utility functions:
  - `arraySubtract` for removing elements of one array from another
  - `randomInt` for generating random integers in a specified range
  - `randomBoolean` for producing random boolean values

<!-- Links -->
[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

<!-- Versions -->
[unreleased]: https://github.com/andranikarakelyan/js-utilities/compare/v0.14.0...HEAD
[0.14.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.12.0...v0.13.0
[0.12.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.11.0...v0.12.0
[0.11.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/andranikarakelyan/js-utilities/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/andranikarakelyan/js-utilities/compare/v0.1.0...v0.2.1
[0.1.0]: https://github.com/andranikarakelyan/js-utilities/compare/v0.0.2...v0.1.0
[0.0.2]: https://github.com/andranikarakelyan/js-utilities/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/andranikarakelyan/js-utilities/releases/tag/v0.0.1