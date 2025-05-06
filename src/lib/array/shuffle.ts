/**
 * Returns a shuffled version of an array using Fisher-Yates algorithm.
 * This function does not mutate the original array.
 * 
 * The Fisher-Yates algorithm is considered superior to naive approaches
 * (like sorting with random comparator) because:
 * 1. It guarantees a truly random permutation with equal probability for each possible outcome
 * 2. It's more efficient with O(n) time complexity
 * 3. It avoids bias that can occur in other methods
 * 
 * Time complexity: O(n) where n is the array length
 * Space complexity: O(n) due to creating a copy of the input array
 * 
 * @param array - The array to shuffle
 * @returns A new array with the same elements in a random order
 * 
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4, 5]);
 * // Might return: [3, 1, 5, 2, 4]
 * ```
 */
export function shuffle<T>(array: T[]): T[] {
  // Create a copy to avoid mutating the original array
  const result = [...array];
  
  // Fisher-Yates shuffle algorithm
  for (let i = result.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at indices i and j
    [result[i], result[j]] = [result[j], result[i]];
  }
  
  return result;
}