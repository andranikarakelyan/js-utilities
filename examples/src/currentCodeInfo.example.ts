import { currentCodeInfo } from "@andranik-arakelyan/js-utilities";


export function currentCodeInfoExample() {

    // named function
    const f = () => {
        console.log('current code info in function\n', currentCodeInfo());
    };
    f();
    /*
        expected output:

        current code info in function
        {
        className: '',
        methodName: 'f',
        filepath: '<your path>/js-utilities/examples/dist/currentCodeInfo.example.js',
        filename: 'currentCodeInfo.example.js',
        lineNumber: 9,
        columnNumber: 83
        }
    */

    // anonymous function
    (() => {
        console.log('current code info in anonymous function\n', currentCodeInfo());
    }
    )();
    /*
        current code info in anonymous function
        {
        className: '',
        methodName: 'anonymous',
        filepath: '<your path>/js-utilities/examples/dist/currentCodeInfo.example.js',
        filename: 'currentCodeInfo.example.js',
        lineNumber: 14,
        columnNumber: 93
        }
    */

    // class method
    class SomeClass {
        someMethod() {
            console.log('current code info in class method\n', currentCodeInfo());
        }
    }
    new SomeClass().someMethod();
    /*
        current code info in class method
        {
        className: 'SomeClass',
        methodName: 'someMethod',
        filepath: '<your path>/js-utilities/examples/dist/currentCodeInfo.example.js',
        filename: 'currentCodeInfo.example.js',
        lineNumber: 19,
        columnNumber: 91
        }
    */

}

// current code info in module context
console.log('current code info in module context\n', currentCodeInfo());
/*
    expected output:
    current code info in module context
    {
    className: 'Object',
    methodName: 'anonymous',
    filepath: '<your path>/js-utilities/examples/dist/currentCodeInfo.example.js',
    filename: 'currentCodeInfo.example.js',
    lineNumber: 24,
    columnNumber: 81
    }
*/