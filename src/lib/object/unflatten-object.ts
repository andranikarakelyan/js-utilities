/**
 * Unflattens a flat object with dot notation keys into a nested object structure.
 * 
 * @param obj - The flattened object to unflatten
 * @returns A nested object structure
 * 
 * @example
 * ```ts
 * const flattened = {
 *   'user.profile.name': 'John',
 *   'user.profile.age': 30,
 *   'user.settings.theme': 'dark',
 *   'app.version': '1.0.0'
 * };
 * 
 * const nested = unflattenObject(flattened);
 * // {
 * //   user: {
 * //     profile: {
 * //       name: 'John',
 * //       age: 30
 * //     },
 * //     settings: {
 * //       theme: 'dark'
 * //     }
 * //   },
 * //   app: {
 * //     version: '1.0.0'
 * //   }
 * // }
 * ```
 */
export function unflattenObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const keys = key.split('.');
      let current = result;

      for (let i = 0; i < keys.length - 1; i++) {
        const currentKey = keys[i];
        if (!(currentKey in current) || typeof current[currentKey] !== 'object' || Array.isArray(current[currentKey])) {
          current[currentKey] = {};
        }
        current = current[currentKey];
      }

      // Set the final value
      const finalKey = keys[keys.length - 1];
      current[finalKey] = obj[key];
    }
  }

  return result;
}
