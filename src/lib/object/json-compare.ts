/**
 * Type of difference found when comparing JSON objects
 */
export type JsonDiffType = 
  | 'missing_key'     // Key exists in base but not in compared object
  | 'extra_key'       // Key exists in compared object but not in base
  | 'type_mismatch';  // Key exists in both but values have different types

/**
 * Represents a single difference found during JSON comparison
 */
export interface JsonDifference {
  /** Index of the compared object (0-based) */
  objectIndex: number;
  /** Type of difference found */
  diffType: JsonDiffType;
  /** Path to the key that has the difference (dot notation) */
  keyPath: string;
  /** Type of value in base object (if key exists) */
  baseValueType?: string;
  /** Type of value in compared object (if key exists) */
  comparedValueType?: string;
}

/**
 * Gets the type of a value for comparison purposes
 */
function getValueType(value: any): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

/**
 * Recursively compares two objects and collects differences
 */
function compareObjects(
  base: any,
  compared: any,
  objectIndex: number,
  differences: JsonDifference[],
  currentPath: string = ''
): void {
  // Handle null or undefined values
  if (base === null || base === undefined || compared === null || compared === undefined) {
    return;
  }

  // If base is not an object, we can't compare keys
  if (typeof base !== 'object' || Array.isArray(base)) {
    return;
  }

  // If compared is not an object, we can't compare keys
  if (typeof compared !== 'object' || Array.isArray(compared)) {
    return;
  }

  const baseKeys = Object.keys(base);
  const comparedKeys = Object.keys(compared);
  const allKeys = new Set([...baseKeys, ...comparedKeys]);

  for (const key of allKeys) {
    const keyPath = currentPath ? `${currentPath}.${key}` : key;
    const hasInBase = key in base;
    const hasInCompared = key in compared;

    if (hasInBase && !hasInCompared) {
      // Key exists in base but not in compared object
      differences.push({
        objectIndex,
        diffType: 'missing_key',
        keyPath,
        baseValueType: getValueType(base[key])
      });
    } else if (!hasInBase && hasInCompared) {
      // Key exists in compared object but not in base
      differences.push({
        objectIndex,
        diffType: 'extra_key',
        keyPath,
        comparedValueType: getValueType(compared[key])
      });
    } else if (hasInBase && hasInCompared) {
      const baseValueType = getValueType(base[key]);
      const comparedValueType = getValueType(compared[key]);

      if (baseValueType !== comparedValueType) {
        // Key exists in both but types are different
        differences.push({
          objectIndex,
          diffType: 'type_mismatch',
          keyPath,
          baseValueType,
          comparedValueType
        });
      } else if (baseValueType === 'object' && comparedValueType === 'object') {
        // Both are objects, recursively compare
        compareObjects(base[key], compared[key], objectIndex, differences, keyPath);
      }
    }
  }
}

/**
 * Compares a base JSON object with multiple other JSON objects and returns differences.
 * 
 * This function performs a deep comparison between a base JSON object and one or more
 * comparison objects, identifying missing keys, extra keys, and type mismatches.
 * 
 * @param base - The base JSON object to compare against
 * @param comparisons - Array of JSON objects to compare with the base
 * @returns Array of differences found during comparison
 * 
 * @example
 * ```ts
 * const base = { 
 *   name: "John", 
 *   age: 30, 
 *   address: { city: "NYC", zip: "10001" } 
 * };
 * 
 * const obj1 = { 
 *   name: "John", 
 *   address: { city: "NYC" } 
 * }; // missing 'age' and 'address.zip'
 * 
 * const obj2 = { 
 *   name: "John", 
 *   age: "30", 
 *   address: { city: "NYC", zip: "10001" },
 *   email: "john@example.com" 
 * }; // 'age' type mismatch, extra 'email'
 * 
 * const differences = jsonCompare(base, [obj1, obj2]);
 * console.log(differences);
 * // [
 * //   { objectIndex: 0, diffType: 'missing_key', keyPath: 'age', baseValueType: 'number' },
 * //   { objectIndex: 0, diffType: 'missing_key', keyPath: 'address.zip', baseValueType: 'string' },
 * //   { objectIndex: 1, diffType: 'type_mismatch', keyPath: 'age', baseValueType: 'number', comparedValueType: 'string' },
 * //   { objectIndex: 1, diffType: 'extra_key', keyPath: 'email', comparedValueType: 'string' }
 * // ]
 * ```
 */
export function jsonCompare(base: any, comparisons: any[]): JsonDifference[] {
  const differences: JsonDifference[] = [];

  comparisons.forEach((comparison, index) => {
    compareObjects(base, comparison, index, differences);
  });

  return differences;
}
