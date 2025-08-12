/**
 * Flattens a nested object into a flat object with dot notation keys.
 * 
 * @param obj - The object to flatten
 * @param prefix - Internal parameter for recursion (do not use)
 * @returns A flattened object with dot notation keys
 * 
 * @example
 * ```ts
 * const nested = {
 *   user: {
 *     profile: {
 *       name: 'John',
 *       age: 30
 *     },
 *     settings: {
 *       theme: 'dark'
 *     }
 *   },
 *   app: {
 *     version: '1.0.0'
 *   }
 * };
 * 
 * const flattened = flattenObject(nested);
 * // {
 * //   'user.profile.name': 'John',
 * //   'user.profile.age': 30,
 * //   'user.settings.theme': 'dark',
 * //   'app.version': '1.0.0'
 * // }
 * ```
 */
export function flattenObject(obj: Record<string, any>, prefix: string = ''): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof RegExp)) {
        // Recursively flatten nested objects
        Object.assign(result, flattenObject(value, newKey));
      } else {
        // Add primitive values, arrays, dates, regexes, and null values as-is
        result[newKey] = value;
      }
    }
  }

  return result;
}
