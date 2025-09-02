/**
 * Deep merges one object into another object, optionally at a specific path.
 * 
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @param path - Optional dot-separated path where the merge should occur (e.g., 'user.profiles.0.transactions')
 * @returns The merged object (modifies the target object)
 * 
 * @example
 * ```ts
 * // Basic deep merge
 * const target = { a: 1, b: { c: 2 } };
 * const source = { b: { d: 3 }, e: 4 };
 * const result = deepMerge(target, source);
 * // { a: 1, b: { c: 2, d: 3 }, e: 4 }
 * ```
 * 
 * @example
 * ```ts
 * // Merge at specific path
 * const target = { 
 *   user: { 
 *     profiles: [
 *       { id: 1, transactions: { count: 5 } }
 *     ] 
 *   } 
 * };
 * const source = { total: 100, recent: ['tx1', 'tx2'] };
 * deepMerge(target, source, 'user.profiles.0.transactions');
 * // Result: target.user.profiles[0].transactions now has count, total, and recent properties
 * ```
 * 
 * @example
 * ```ts
 * // Array handling - arrays are replaced, not merged
 * const target = { items: [1, 2, 3] };
 * const source = { items: [4, 5] };
 * deepMerge(target, source);
 * // { items: [4, 5] } - arrays are replaced
 * ```
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Record<string, any>,
  path?: string
): T {
  if (!target || typeof target !== 'object') {
    throw new Error('Target must be an object');
  }

  if (!source || typeof source !== 'object') {
    return target;
  }

  // If path is provided, navigate to the target location
  if (path) {
    const pathParts = path.split('.');
    let current: any = target;

    // Navigate to the parent of the target location
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      
      // Handle array indices
      if (!isNaN(Number(part))) {
        const index = Number(part);
        if (!Array.isArray(current)) {
          throw new Error(`Expected array at path segment '${pathParts.slice(0, i).join('.')}', but found ${typeof current}`);
        }
        if (index >= current.length) {
          throw new Error(`Array index ${index} is out of bounds at path '${pathParts.slice(0, i + 1).join('.')}'`);
        }
        current = current[index];
      } else {
        // Handle object properties
        if (!current[part] || typeof current[part] !== 'object') {
          current[part] = {};
        }
        current = current[part];
      }
    }

    // Get the final property name
    const finalPart = pathParts[pathParts.length - 1];
    
    // Handle final array index
    if (!isNaN(Number(finalPart))) {
      const index = Number(finalPart);
      if (!Array.isArray(current)) {
        throw new Error(`Expected array at path segment '${pathParts.slice(0, -1).join('.')}', but found ${typeof current}`);
      }
      if (index >= current.length) {
        throw new Error(`Array index ${index} is out of bounds at path '${path}'`);
      }
      
      // Ensure the array element is an object for merging
      if (!current[index] || typeof current[index] !== 'object') {
        current[index] = {};
      }
      
      // Perform the merge at the array element
      performDeepMerge(current[index], source);
    } else {
      // Handle final object property
      if (!current[finalPart] || typeof current[finalPart] !== 'object') {
        current[finalPart] = {};
      }
      
      // Perform the merge at the object property
      performDeepMerge(current[finalPart], source);
    }
  } else {
    // Perform direct merge on the target
    performDeepMerge(target as Record<string, any>, source);
  }

  return target;
}

/**
 * Internal helper function that performs the actual deep merge logic
 */
function performDeepMerge(target: Record<string, any>, source: Record<string, any>): void {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      
      if (sourceValue === null || sourceValue === undefined) {
        // Handle null/undefined values
        target[key] = sourceValue;
      } else if (Array.isArray(sourceValue)) {
        // Arrays are replaced, not merged
        target[key] = [...sourceValue];
      } else if (typeof sourceValue === 'object' && 
                 sourceValue.constructor === Object && 
                 target[key] && 
                 typeof target[key] === 'object' && 
                 target[key].constructor === Object) {
        // Both are plain objects, merge recursively
        performDeepMerge(target[key], sourceValue);
      } else {
        // Primitive values, dates, regexes, functions, etc. - replace
        target[key] = sourceValue;
      }
    }
  }
}
