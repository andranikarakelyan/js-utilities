/**
 * A Promise Pool that manages the execution of asynchronous functions with a maximum concurrency limit.
 * Functions are queued and executed in batches, ensuring no more than the specified number run simultaneously.
 */
export class PromisePool {
  private readonly concurrency: number;
  private running = 0;
  private queue: Array<() => void> = [];

  /**
   * Creates a new Promise Pool with the specified concurrency limit.
   * @param concurrency - Maximum number of async functions that can run simultaneously
   */
  constructor(concurrency: number) {
    if (concurrency <= 0) {
      throw new Error('Concurrency must be greater than 0');
    }
    this.concurrency = concurrency;
  }

  /**
   * Executes an async function within the concurrency limits of the pool.
   * If the pool is at capacity, the function is queued until a slot becomes available.
   * @param fn - The async function to execute
   * @returns A promise that resolves with the result of the async function
   */
  execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const task = async () => {
        try {
          this.running++;
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.processQueue();
        }
      };

      if (this.running < this.concurrency) {
        task();
      } else {
        this.queue.push(task);
      }
    });
  }

  /**
   * Processes the next task in the queue if there's available capacity.
   */
  private processQueue(): void {
    if (this.queue.length > 0 && this.running < this.concurrency) {
      const nextTask = this.queue.shift()!;
      nextTask();
    }
  }

  /**
   * Returns the current number of running tasks.
   */
  get runningCount(): number {
    return this.running;
  }

  /**
   * Returns the current number of queued tasks.
   */
  get queuedCount(): number {
    return this.queue.length;
  }

  /**
   * Returns true if the pool is currently at maximum capacity.
   */
  get isAtCapacity(): boolean {
    return this.running >= this.concurrency;
  }

  /**
   * Returns the maximum concurrency limit of this pool.
   */
  get maxConcurrency(): number {
    return this.concurrency;
  }
}
