import { currentCodeInfo, ICurrentCodeInfoResult } from "./currentCodeInfo";

describe('currentCodeInfo', () => {

    it('should return correct code info, when called in class method', () => {
        class SomeClass {
            someMethod() {
                return currentCodeInfo();
            }
        }
        
        const result = new SomeClass().someMethod();
        expect(result.className).toEqual('SomeClass');
        expect(result.methodName).toEqual('someMethod');
        expect(result.filename).toEqual('currentCodeInfo.spec.ts');
        expect(result.lineNumber).toBeGreaterThan(0);
        expect(result.columnNumber).toBeGreaterThan(0);
    });

    it('should return method name, if it called in pure function', () => {
        function someFunction() {
            return currentCodeInfo();
        }

        const result = someFunction();
        expect(result.className).toEqual('');
        expect(result.methodName).toEqual('someFunction');
        expect(result.filename).toEqual('currentCodeInfo.spec.ts');
        expect(result.lineNumber).toBeGreaterThan(0);
        expect(result.columnNumber).toBeGreaterThan(0);
    });

    it('should return correct code info, when called in anonymous function', () => {
        const result = (() => {
            return currentCodeInfo();
        })();

        expect(result.className).toEqual('');
        expect(result.methodName).toEqual('anonymous');
        expect(result.filename).toEqual('currentCodeInfo.spec.ts');
        expect(result.lineNumber).toBeGreaterThan(0);
        expect(result.columnNumber).toBeGreaterThan(0);
    });
});

