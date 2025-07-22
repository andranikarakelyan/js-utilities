import { range, rangeIterable } from './src/lib/generator/range';

console.log('=== Testing range function ===');

// Basic usage examples
console.log('range(5):', [...range(5)]);
console.log('range(2, 8):', [...range(2, 8)]);
console.log('range(0, 10, 2):', [...range(0, 10, 2)]);
console.log('range(10, 0, -2):', [...range(10, 0, -2)]);

// Memory efficiency test
console.log('\n=== Memory efficiency test ===');
console.log('Large range with for...of loop (only first 5):');
let count = 0;
for (const i of range(1000000)) {
  console.log(i);
  count++;
  if (count === 5) break;
}

// rangeIterable test
console.log('\n=== rangeIterable test ===');
const r = rangeIterable(0, 3);
console.log('First iteration:', [...r]);
console.log('Second iteration:', [...r]);

console.log('\n=== All tests completed successfully! ===');
