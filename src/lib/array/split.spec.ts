import { arraySplit } from "./split";

describe('split array', () => {

    it('should split array by separator value', () => {
        const a1 = [1, 2, 3 , 2, 4];
        const result1 = arraySplit(a1, 2);
        expect(result1).toEqual([[1], [3], [4]]);

        const a2 = [1, 1, 2, 3, 2, 4];
        const result2 = arraySplit(a2, 2);
        expect(result2).toEqual([[1, 1], [3], [4]]);
    });

    it('should split array by separator function', () => {
        const a1 = [1, 3, 2, 3, 5, 7, 4, 5, 6, 7, 8, 9, 11, 1];
        const result1 = arraySplit(a1, (item) => item % 2 === 0);
        expect(result1).toEqual([[1, 3], [3, 5, 7], [5], [7], [9, 11, 1]]);
    });

    it('should split array by separator function with empty array', () => {
        const a1: number[] = [];
        const result1 = arraySplit(a1, (item) => item % 2 === 0);
        expect(result1).toEqual([]);
    });

    it('should handle separator at the start of the array', () => {
        const a1 = [2, 1, 3, 4];
        const result1 = arraySplit(a1, 2);
        expect(result1).toEqual([[1, 3, 4]]);
    });

    it('should handle separator at the end of the array', () => {
        const a1 = [1, 3, 4, 2];
        const result1 = arraySplit(a1, 2);
        expect(result1).toEqual([[1, 3, 4]]);
    });

    it('should handle separator at both the start and end of the array', () => {
        const a1 = [2, 1, 3, 4, 2];
        const result1 = arraySplit(a1, 2);
        expect(result1).toEqual([[1, 3, 4]]);
    });

});
