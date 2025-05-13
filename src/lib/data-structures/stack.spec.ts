import { Stack } from './stack';

describe('Stack', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack<number>();
  });

  it('should create an empty stack', () => {
    expect(stack.size()).toBe(0);
    expect(stack.isEmpty()).toBe(true);
    expect(stack.peek()).toBeUndefined();
  });

  it('should push items to the stack', () => {
    const result = stack.push(1);
    expect(result).toBe(1);
    expect(stack.size()).toBe(1);
    expect(stack.isEmpty()).toBe(false);
    
    stack.push(2);
    stack.push(3);
    expect(stack.size()).toBe(3);
  });

  it('should pop items from the stack in LIFO order', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.pop()).toBeUndefined();
  });

  it('should peek at the top item without removing it', () => {
    stack.push(1);
    stack.push(2);
    
    expect(stack.peek()).toBe(2);
    expect(stack.size()).toBe(2); // size should remain the same
  });

  it('should clear all items from the stack', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    
    stack.clear();
    expect(stack.size()).toBe(0);
    expect(stack.isEmpty()).toBe(true);
  });

  it('should return items as an array', () => {
    stack.push(1);
    stack.push(2);
    stack.push(3);
    
    expect(stack.toArray()).toEqual([1, 2, 3]);
    expect(stack.size()).toBe(3); // stack should remain unchanged
  });
});