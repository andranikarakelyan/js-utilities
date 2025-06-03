# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [Unreleased]

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
[unreleased]: https://github.com/andranikarakelyan/js-utilities/compare/v0.8.0...HEAD
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