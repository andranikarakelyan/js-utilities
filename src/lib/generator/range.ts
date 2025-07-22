/**
 * Generates a sequence of numbers from start to stop (exclusive) with an optional step.
 * This is a JavaScript implementation of Python's range() function using generators.
 * Returns an iterator that yields numbers on demand without creating an array in memory.
 * 
 * @param start The starting value of the sequence
 * @param stop The ending value of the sequence (exclusive)
 * @param step The step between values (defaults to 1)
 * @returns A generator that yields numbers in the specified range
 * 
 * @throws {Error} When step is 0
 * 
 * @example
 * // Basic usage - range(stop)
 * [...range(5)]; // [0, 1, 2, 3, 4]
 * 
 * @example
 * // With start and stop - range(start, stop)
 * [...range(2, 8)]; // [2, 3, 4, 5, 6, 7]
 * 
 * @example
 * // With step - range(start, stop, step)
 * [...range(0, 10, 2)]; // [0, 2, 4, 6, 8]
 * [...range(10, 0, -2)]; // [10, 8, 6, 4, 2]
 * 
 * @example
 * // Using with for...of loop (memory efficient)
 * for (const i of range(1000000)) {
 *   if (i > 5) break;
 *   console.log(i); // 0, 1, 2, 3, 4, 5
 * }
 * 
 * @example
 * // Negative ranges
 * [...range(-5, -1)]; // [-5, -4, -3, -2]
 * [...range(-1, -5, -1)]; // [-1, -2, -3, -4]
 * 
 * @example
 * // Empty ranges
 * [...range(5, 5)]; // []
 * [...range(5, 0)]; // []
 * [...range(0, 5, -1)]; // []
 */
export function* range(start: number, stop?: number, step: number = 1): Generator<number, void, unknown> {
  // Handle single argument case: range(stop)
  if (stop === undefined) {
    stop = start;
    start = 0;
  }

  // Validate step
  if (step === 0) {
    throw new Error('Step cannot be zero');
  }

  // Generate the sequence
  let current = start;
  
  if (step > 0) {
    while (current < stop) {
      yield current;
      current += step;
    }
  } else {
    while (current > stop) {
      yield current;
      current += step;
    }
  }
}

/**
 * Creates a range iterator that can be used multiple times.
 * Unlike the generator function, this returns an iterable object
 * that can be iterated over multiple times.
 * 
 * @param start The starting value of the sequence
 * @param stop The ending value of the sequence (exclusive)
 * @param step The step between values (defaults to 1)
 * @returns An iterable object that can be used with for...of loops multiple times
 * 
 * @example
 * const r = rangeIterable(0, 5);
 * [...r]; // [0, 1, 2, 3, 4]
 * [...r]; // [0, 1, 2, 3, 4] - can be used again
 */
export function rangeIterable(start: number, stop?: number, step: number = 1): Iterable<number> {
  return {
    [Symbol.iterator]() {
      return range(start, stop, step);
    }
  };
}
