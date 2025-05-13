import { Queue } from './queue';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  it('should create an empty queue', () => {
    expect(queue.size()).toBe(0);
    expect(queue.isEmpty()).toBe(true);
    expect(queue.peek()).toBeUndefined();
  });

  it('should enqueue items to the queue', () => {
    const result = queue.enqueue(1);
    expect(result).toBe(1);
    expect(queue.size()).toBe(1);
    expect(queue.isEmpty()).toBe(false);
    
    queue.enqueue(2);
    queue.enqueue(3);
    expect(queue.size()).toBe(3);
  });

  it('should dequeue items from the queue in FIFO order', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    
    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBeUndefined();
  });

  it('should peek at the front item without removing it', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    
    expect(queue.peek()).toBe(1);
    expect(queue.size()).toBe(2); // size should remain the same
  });

  it('should clear all items from the queue', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    
    queue.clear();
    expect(queue.size()).toBe(0);
    expect(queue.isEmpty()).toBe(true);
  });

  it('should return items as an array', () => {
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    
    expect(queue.toArray()).toEqual([1, 2, 3]);
    expect(queue.size()).toBe(3); // queue should remain unchanged
  });
});