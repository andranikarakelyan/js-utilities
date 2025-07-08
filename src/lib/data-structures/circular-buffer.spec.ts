import { CircularBuffer } from './circular-buffer';

describe('CircularBuffer', () => {
  describe('constructor', () => {
    it('should create a buffer with specified capacity', () => {
      const buffer = new CircularBuffer<number>(5);
      expect(buffer.capacity()).toBe(5);
      expect(buffer.size()).toBe(0);
      expect(buffer.isEmpty()).toBe(true);
      expect(buffer.isFull()).toBe(false);
    });

    it('should throw error for non-positive capacity', () => {
      expect(() => new CircularBuffer<number>(0)).toThrow('Capacity must be a positive integer');
      expect(() => new CircularBuffer<number>(-1)).toThrow('Capacity must be a positive integer');
    });

    it('should throw error for non-integer capacity', () => {
      expect(() => new CircularBuffer<number>(3.5)).toThrow('Capacity must be a positive integer');
    });
  });

  describe('push', () => {
    it('should add elements when buffer is not full', () => {
      const buffer = new CircularBuffer<number>(3);
      
      buffer.push(1);
      expect(buffer.size()).toBe(1);
      expect(buffer.toArray()).toEqual([1]);
      
      buffer.push(2);
      expect(buffer.size()).toBe(2);
      expect(buffer.toArray()).toEqual([1, 2]);
      
      buffer.push(3);
      expect(buffer.size()).toBe(3);
      expect(buffer.toArray()).toEqual([1, 2, 3]);
      expect(buffer.isFull()).toBe(true);
    });

    it('should overwrite oldest elements when buffer is full', () => {
      const buffer = new CircularBuffer<number>(3);
      
      // Fill buffer
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      
      // Add more elements - should overwrite oldest
      buffer.push(4);
      expect(buffer.toArray()).toEqual([2, 3, 4]);
      expect(buffer.size()).toBe(3);
      
      buffer.push(5);
      expect(buffer.toArray()).toEqual([3, 4, 5]);
      expect(buffer.size()).toBe(3);
    });

    it('should work with different data types', () => {
      const stringBuffer = new CircularBuffer<string>(2);
      stringBuffer.push("hello");
      stringBuffer.push("world");
      expect(stringBuffer.toArray()).toEqual(["hello", "world"]);
      
      const objectBuffer = new CircularBuffer<{ id: number; name: string }>(2);
      objectBuffer.push({ id: 1, name: "Alice" });
      objectBuffer.push({ id: 2, name: "Bob" });
      expect(objectBuffer.toArray()).toEqual([
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
      ]);
    });
  });

  describe('shift', () => {
    it('should return undefined for empty buffer', () => {
      const buffer = new CircularBuffer<number>(3);
      expect(buffer.shift()).toBeUndefined();
    });

    it('should remove and return oldest element', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      
      expect(buffer.shift()).toBe(1);
      expect(buffer.toArray()).toEqual([2, 3]);
      expect(buffer.size()).toBe(2);
      
      expect(buffer.shift()).toBe(2);
      expect(buffer.toArray()).toEqual([3]);
      expect(buffer.size()).toBe(1);
      
      expect(buffer.shift()).toBe(3);
      expect(buffer.toArray()).toEqual([]);
      expect(buffer.size()).toBe(0);
      expect(buffer.isEmpty()).toBe(true);
    });

    it('should work correctly after buffer wrapping', () => {
      const buffer = new CircularBuffer<number>(3);
      
      // Fill and wrap buffer
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      buffer.push(4); // Overwrites 1
      buffer.push(5); // Overwrites 2
      
      expect(buffer.toArray()).toEqual([3, 4, 5]);
      
      expect(buffer.shift()).toBe(3);
      expect(buffer.toArray()).toEqual([4, 5]);
    });
  });

  describe('get', () => {
    it('should throw error for out of bounds index', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      
      expect(() => buffer.get(-1)).toThrow('Index -1 is out of bounds. Buffer size is 2');
      expect(() => buffer.get(2)).toThrow('Index 2 is out of bounds. Buffer size is 2');
    });

    it('should return element at specified index', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      
      expect(buffer.get(0)).toBe(1); // oldest
      expect(buffer.get(1)).toBe(2);
      expect(buffer.get(2)).toBe(3); // newest
    });

    it('should work correctly after buffer wrapping', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      buffer.push(4); // Overwrites 1, buffer is now [2, 3, 4]
      
      expect(buffer.get(0)).toBe(2); // oldest
      expect(buffer.get(1)).toBe(3);
      expect(buffer.get(2)).toBe(4); // newest
    });
  });

  describe('peek and peekOldest', () => {
    it('should return undefined for empty buffer', () => {
      const buffer = new CircularBuffer<number>(3);
      expect(buffer.peek()).toBeUndefined();
      expect(buffer.peekOldest()).toBeUndefined();
    });

    it('should return newest and oldest elements without removing them', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      
      expect(buffer.peek()).toBe(3); // newest
      expect(buffer.peekOldest()).toBe(1); // oldest
      expect(buffer.size()).toBe(3); // size unchanged
      expect(buffer.toArray()).toEqual([1, 2, 3]); // buffer unchanged
    });

    it('should work correctly after buffer wrapping', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      buffer.push(4); // Buffer is now [2, 3, 4]
      
      expect(buffer.peek()).toBe(4); // newest
      expect(buffer.peekOldest()).toBe(2); // oldest
    });
  });

  describe('size, capacity, isFull, isEmpty', () => {
    it('should track size correctly', () => {
      const buffer = new CircularBuffer<number>(3);
      
      expect(buffer.size()).toBe(0);
      expect(buffer.isEmpty()).toBe(true);
      expect(buffer.isFull()).toBe(false);
      
      buffer.push(1);
      expect(buffer.size()).toBe(1);
      expect(buffer.isEmpty()).toBe(false);
      expect(buffer.isFull()).toBe(false);
      
      buffer.push(2);
      buffer.push(3);
      expect(buffer.size()).toBe(3);
      expect(buffer.isEmpty()).toBe(false);
      expect(buffer.isFull()).toBe(true);
      
      // Adding more shouldn't change size when full
      buffer.push(4);
      expect(buffer.size()).toBe(3);
      expect(buffer.isFull()).toBe(true);
    });

    it('should maintain capacity', () => {
      const buffer = new CircularBuffer<number>(5);
      expect(buffer.capacity()).toBe(5);
      
      // Capacity should not change
      buffer.push(1);
      buffer.push(2);
      expect(buffer.capacity()).toBe(5);
    });
  });

  describe('clear', () => {
    it('should remove all elements and reset buffer', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      
      buffer.clear();
      
      expect(buffer.size()).toBe(0);
      expect(buffer.isEmpty()).toBe(true);
      expect(buffer.isFull()).toBe(false);
      expect(buffer.toArray()).toEqual([]);
      expect(buffer.peek()).toBeUndefined();
      expect(buffer.peekOldest()).toBeUndefined();
    });

    it('should work correctly after clearing and adding new elements', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.clear();
      
      buffer.push(10);
      buffer.push(20);
      
      expect(buffer.toArray()).toEqual([10, 20]);
      expect(buffer.size()).toBe(2);
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty buffer', () => {
      const buffer = new CircularBuffer<number>(3);
      expect(buffer.toArray()).toEqual([]);
    });

    it('should return elements in order from oldest to newest', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      
      expect(buffer.toArray()).toEqual([1, 2, 3]);
    });

    it('should return correct order after buffer wrapping', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      buffer.push(4); // Overwrites 1
      buffer.push(5); // Overwrites 2
      
      expect(buffer.toArray()).toEqual([3, 4, 5]);
    });

    it('should return a new array (not reference to internal buffer)', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      
      const array1 = buffer.toArray();
      const array2 = buffer.toArray();
      
      expect(array1).not.toBe(array2); // Different references
      expect(array1).toEqual(array2); // Same content
      
      array1.push(999);
      expect(buffer.toArray()).not.toContain(999); // Original buffer unchanged
    });
  });

  describe('iterator', () => {
    it('should be iterable with for...of loop', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      
      const result: number[] = [];
      for (const item of buffer) {
        result.push(item);
      }
      
      expect(result).toEqual([1, 2, 3]);
    });

    it('should work with Array.from', () => {
      const buffer = new CircularBuffer<string>(3);
      buffer.push("a");
      buffer.push("b");
      buffer.push("c");
      
      const array = Array.from(buffer);
      expect(array).toEqual(["a", "b", "c"]);
    });

    it('should iterate correctly after buffer wrapping', () => {
      const buffer = new CircularBuffer<number>(3);
      buffer.push(1);
      buffer.push(2);
      buffer.push(3);
      buffer.push(4); // Buffer is now [2, 3, 4]
      
      const result = Array.from(buffer);
      expect(result).toEqual([2, 3, 4]);
    });
  });

  describe('edge cases', () => {
    it('should work with buffer of size 1', () => {
      const buffer = new CircularBuffer<number>(1);
      
      buffer.push(1);
      expect(buffer.toArray()).toEqual([1]);
      expect(buffer.isFull()).toBe(true);
      
      buffer.push(2);
      expect(buffer.toArray()).toEqual([2]);
      expect(buffer.size()).toBe(1);
    });

    it('should handle null and undefined values', () => {
      const buffer = new CircularBuffer<number | null | undefined>(3);
      buffer.push(null);
      buffer.push(undefined);
      buffer.push(0);
      
      expect(buffer.toArray()).toEqual([null, undefined, 0]);
      expect(buffer.peek()).toBe(0);
      expect(buffer.peekOldest()).toBe(null);
    });

    it('should work with complex objects', () => {
      interface Task {
        id: number;
        title: string;
        completed: boolean;
      }
      
      const buffer = new CircularBuffer<Task>(2);
      const task1: Task = { id: 1, title: "Task 1", completed: false };
      const task2: Task = { id: 2, title: "Task 2", completed: true };
      const task3: Task = { id: 3, title: "Task 3", completed: false };
      
      buffer.push(task1);
      buffer.push(task2);
      buffer.push(task3); // Should overwrite task1
      
      expect(buffer.toArray()).toEqual([task2, task3]);
      expect(buffer.get(0)).toBe(task2);
      expect(buffer.peek()).toBe(task3);
    });
  });
});
