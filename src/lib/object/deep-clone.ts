/**
 * Creates a deep clone of an object or array, creating a new copy of all nested objects and arrays.
 * This function handles circular references and complex JavaScript types.
 * 
 * @template T - The type of value to clone
 * @param value - The value to clone
 * @returns A deep clone of the input value
 * 
 * @example
 * // Simple object cloning
 * const obj = { a: 1, b: { c: 2 } };
 * const clone = deepClone(obj);
 * clone.b.c = 3;
 * console.log(obj.b.c); // Still 2
 * 
 * @example
 * // Handling arrays and nested structures
 * const arr = [1, { x: [2, 3] }];
 * const cloneArr = deepClone(arr);
 * cloneArr[1].x[0] = 10;
 * console.log(arr[1].x[0]); // Still 2
 * 
 * @example
 * // Handling circular references
 * const circular = { a: 1 };
 * circular.self = circular;
 * const cloneCircular = deepClone(circular);
 * console.log(cloneCircular.self === cloneCircular); // true
 */
export function deepClone<T>(value: T, refs = new WeakMap()): T {
  // Handle null, undefined and primitive types
  if (value === null || value === undefined) {
    return value;
  }

  if (!(value instanceof Object)) {
    return value;
  }

  // Handle built-in special types
  if (value instanceof Date) {
    return new Date(value.getTime()) as unknown as T;
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags) as unknown as T;
  }

  // Check for circular references
  if (refs.has(value as object)) {
    return refs.get(value as object);
  }

  // Handle arrays
  if (Array.isArray(value)) {
    const clone: unknown[] = [];
    refs.set(value, clone);
    clone.push(...value.map(item => deepClone(item, refs)));
    return clone as unknown as T;
  }

  // Handle Set
  if (value instanceof Set) {
    const clone = new Set();
    refs.set(value, clone);
    value.forEach(item => clone.add(deepClone(item, refs)));
    return clone as unknown as T;
  }

  // Handle Map
  if (value instanceof Map) {
    const clone = new Map();
    refs.set(value, clone);
    value.forEach((val, key) => clone.set(deepClone(key, refs), deepClone(val, refs)));
    return clone as unknown as T;
  }

  // Handle objects
  const clone = Object.create(Object.getPrototypeOf(value));
  refs.set(value as object, clone);

  return Object.assign(
    clone,
    Object.fromEntries(
      Object.entries(value as object).map(
        ([key, val]) => [key, deepClone(val, refs)]
      )
    )
  );
}
