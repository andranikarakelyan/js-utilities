import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('should return a new array with the same length', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffle(original);
    expect(shuffled.length).toBe(original.length);
  });

  it('should return a new array with the same elements', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffle(original);
    expect(new Set(shuffled)).toEqual(new Set(original));
  });

  it('should not modify the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const originalCopy = [...original];
    shuffle(original);
    expect(original).toEqual(originalCopy);
  });

  it('should return a different order with high probability', () => {
    // This test could theoretically fail due to randomness, but it's highly unlikely
    const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let differentOrder = false;
    
    // Try multiple times to account for rare cases where shuffle returns the same order
    for (let i = 0; i < 5; i++) {
      const shuffled = shuffle(original);
      if (!arraysAreEqual(shuffled, original)) {
        differentOrder = true;
        break;
      }
    }
    
    expect(differentOrder).toBe(true);
  });

  it('should handle empty arrays', () => {
    const empty: number[] = [];
    expect(shuffle(empty)).toEqual([]);
  });

  it('should handle arrays with one element', () => {
    const singleElement = ['a'];
    expect(shuffle(singleElement)).toEqual(['a']);
  });
});

// Helper function to compare arrays
function arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}