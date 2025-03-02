import { arraySubtract } from "./subtract";

describe('subtract array', () => {

    it('should subtract two arrays', () => {
        const a = [1, 2, 3, 4, 5];
        const b = [1, 3, 5];
        const result = arraySubtract(a, b);
        expect(result).toEqual([2, 4]);
    });

    it('should subtract two arrays with strings', () => {
        const a = ['a', 'b', 'c', 'd', 'e'];
        const b = ['a', 'c', 'e'];
        const result = arraySubtract(a, b);
        expect(result).toEqual(['b', 'd']);
    });

    it('should subtract two arrays with empty array', () => {
        const a = [1, 2, 3, 4, 5];
        const b: number[] = [];
        const result = arraySubtract(a, b);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should subtract two arrays with empty array', () => {
        const a: number[] = [];
        const b = [1, 2, 3, 4, 5];
        const result = arraySubtract(a, b);
        expect(result).toEqual([]);
    });

    it('should subtract two arrays with empty arrays', () => {
        const a: number[] = [];
        const b: number[] = [];
        const result = arraySubtract(a, b);
        expect(result).toEqual([]);
    });

    it('should return an empty array if all elements are subtracted', () => {
        const a = ['a', 'b', 'c', 'd', 'e'];
        const b = ['a', 'b', 'c', 'd', 'e'];
        const result = arraySubtract(a, b);
        expect(result).toEqual([]);
    });

});
