import { PromisePool } from './promise-pool';

describe('PromisePool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a pool with valid concurrency', () => {
      const pool = new PromisePool(3);
      expect(pool.maxConcurrency).toBe(3);
      expect(pool.runningCount).toBe(0);
      expect(pool.queuedCount).toBe(0);
      expect(pool.isAtCapacity).toBe(false);
    });

    it('should throw error for invalid concurrency', () => {
      expect(() => new PromisePool(0)).toThrow('Concurrency must be greater than 0');
      expect(() => new PromisePool(-1)).toThrow('Concurrency must be greater than 0');
    });
  });

  describe('execute', () => {
    it('should execute function immediately when under capacity', async () => {
      const pool = new PromisePool(2);
      const mockFn = jest.fn().mockResolvedValue('result');

      const result = await pool.execute(mockFn);

      expect(result).toBe('result');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle async function errors', async () => {
      const pool = new PromisePool(1);
      const error = new Error('Test error');
      const mockFn = jest.fn().mockRejectedValue(error);

      await expect(pool.execute(mockFn)).rejects.toThrow('Test error');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should enforce concurrency limit', async () => {
      const pool = new PromisePool(2);
      let resolveFirst: (value: string) => void;
      let resolveSecond: (value: string) => void;
      let resolveThird: (value: string) => void;

      const firstPromise = new Promise<string>(resolve => { resolveFirst = resolve; });
      const secondPromise = new Promise<string>(resolve => { resolveSecond = resolve; });
      const thirdPromise = new Promise<string>(resolve => { resolveThird = resolve; });

      const mockFn1 = jest.fn().mockReturnValue(firstPromise);
      const mockFn2 = jest.fn().mockReturnValue(secondPromise);
      const mockFn3 = jest.fn().mockReturnValue(thirdPromise);

      // Start three tasks
      const task1 = pool.execute(mockFn1);
      const task2 = pool.execute(mockFn2);
      const task3 = pool.execute(mockFn3);

      // Wait a bit to ensure functions are called in order
      await new Promise(resolve => setTimeout(resolve, 10));

      // First two should start immediately
      expect(mockFn1).toHaveBeenCalledTimes(1);
      expect(mockFn2).toHaveBeenCalledTimes(1);
      expect(mockFn3).toHaveBeenCalledTimes(0); // Should be queued

      expect(pool.runningCount).toBe(2);
      expect(pool.queuedCount).toBe(1);
      expect(pool.isAtCapacity).toBe(true);

      // Complete first task
      resolveFirst!('result1');
      await task1;

      // Wait a bit for queue processing
      await new Promise(resolve => setTimeout(resolve, 10));

      // Third task should now start
      expect(mockFn3).toHaveBeenCalledTimes(1);
      expect(pool.runningCount).toBe(2);
      expect(pool.queuedCount).toBe(0);

      // Complete remaining tasks
      resolveSecond!('result2');
      resolveThird!('result3');

      const results = await Promise.all([task1, task2, task3]);
      expect(results).toEqual(['result1', 'result2', 'result3']);
    });

    it('should handle multiple queued tasks', async () => {
      const pool = new PromisePool(1);
      const results: string[] = [];
      let resolvers: Array<(value: string) => void> = [];

      const createTask = (id: string) => {
        return () => new Promise<string>(resolve => {
          resolvers.push((value) => {
            results.push(`${id}:${value}`);
            resolve(`${id}:${value}`);
          });
        });
      };

      // Queue 5 tasks with concurrency of 1
      const tasks = [
        pool.execute(createTask('task1')),
        pool.execute(createTask('task2')),
        pool.execute(createTask('task3')),
        pool.execute(createTask('task4')),
        pool.execute(createTask('task5'))
      ];

      // Wait for setup
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(pool.runningCount).toBe(1);
      expect(pool.queuedCount).toBe(4);

      // Resolve tasks one by one
      for (let i = 0; i < 5; i++) {
        expect(resolvers.length).toBeGreaterThan(i);
        resolvers[i]('completed');
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      await Promise.all(tasks);

      expect(results).toEqual([
        'task1:completed',
        'task2:completed', 
        'task3:completed',
        'task4:completed',
        'task5:completed'
      ]);
      expect(pool.runningCount).toBe(0);
      expect(pool.queuedCount).toBe(0);
    });

    it('should preserve function return types', async () => {
      const pool = new PromisePool(1);

      const stringTask = pool.execute(async (): Promise<string> => 'hello');
      const numberTask = pool.execute(async (): Promise<number> => 42);
      const objectTask = pool.execute(async (): Promise<{id: number}> => ({id: 1}));

      const stringResult = await stringTask;
      const numberResult = await numberTask;
      const objectResult = await objectTask;

      // TypeScript should infer correct types
      expect(typeof stringResult).toBe('string');
      expect(typeof numberResult).toBe('number');
      expect(typeof objectResult).toBe('object');

      expect(stringResult).toBe('hello');
      expect(numberResult).toBe(42);
      expect(objectResult).toEqual({id: 1});
    });

    it('should handle concurrent execution with different completion times', async () => {
      const pool = new PromisePool(3);
      const executionOrder: string[] = [];

      const createDelayedTask = (id: string, delay: number) => {
        return async () => {
          await new Promise(resolve => setTimeout(resolve, delay));
          executionOrder.push(id);
          return id;
        };
      };

      // Start tasks with different delays
      const tasks = [
        pool.execute(createDelayedTask('fast', 10)),     // Should complete first
        pool.execute(createDelayedTask('medium', 30)),   // Should complete second
        pool.execute(createDelayedTask('slow', 50))      // Should complete third
      ];

      const results = await Promise.all(tasks);

      expect(results).toEqual(['fast', 'medium', 'slow']);
      expect(executionOrder).toEqual(['fast', 'medium', 'slow']);
    });

    it('should clean up properly after errors', async () => {
      const pool = new PromisePool(1);
      
      const errorTask = pool.execute(async () => {
        throw new Error('Task failed');
      });

      const successTask = pool.execute(async () => {
        return 'success';
      });

      await expect(errorTask).rejects.toThrow('Task failed');
      const result = await successTask;

      expect(result).toBe('success');
      expect(pool.runningCount).toBe(0);
      expect(pool.queuedCount).toBe(0);
    });
  });

  describe('properties', () => {
    it('should correctly report running and queued counts', async () => {
      const pool = new PromisePool(2);
      let resolveFirst: (value: string) => void;
      let resolveSecond: (value: string) => void;
      let resolveThird: (value: string) => void;

      const firstPromise = new Promise<string>(resolve => { resolveFirst = resolve; });
      const secondPromise = new Promise<string>(resolve => { resolveSecond = resolve; });
      const thirdPromise = new Promise<string>(resolve => { resolveThird = resolve; });

      const mockFn1 = jest.fn().mockReturnValue(firstPromise);
      const mockFn2 = jest.fn().mockReturnValue(secondPromise);
      const mockFn3 = jest.fn().mockReturnValue(thirdPromise);

      // Start tasks that will block
      const task1 = pool.execute(mockFn1);
      const task2 = pool.execute(mockFn2);
      const task3 = pool.execute(mockFn3); // This should be queued

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(pool.runningCount).toBe(2);
      expect(pool.queuedCount).toBe(1);
      expect(pool.isAtCapacity).toBe(true);
      expect(pool.maxConcurrency).toBe(2);

      // Resolve the first task
      resolveFirst!('done');
      await task1;
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(pool.runningCount).toBe(2); // Third task should have started
      expect(pool.queuedCount).toBe(0);
      expect(pool.isAtCapacity).toBe(true);

      // Complete remaining tasks
      resolveSecond!('done');
      resolveThird!('done');
      await Promise.all([task2, task3]);

      expect(pool.runningCount).toBe(0);
      expect(pool.queuedCount).toBe(0);
      expect(pool.isAtCapacity).toBe(false);
    });
  });
});
