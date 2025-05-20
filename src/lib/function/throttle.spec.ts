import { throttle } from './throttle';

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  it('should execute the function immediately on first call', () => {
    const func = jest.fn().mockReturnValue('result');
    const throttled = throttle(func, 100);
    
    const result = throttled();
    expect(func).toHaveBeenCalledTimes(1);
    expect(result).toBe('result');
  });
  
  it('should not execute the function on subsequent calls within wait period', () => {
    const func = jest.fn().mockReturnValue('first call');
    const throttled = throttle(func, 100);
    
    const result1 = throttled();
    expect(func).toHaveBeenCalledTimes(1);
    expect(result1).toBe('first call');
    
    // Call again within the wait period
    jest.advanceTimersByTime(50);
    const result2 = throttled();
    expect(func).toHaveBeenCalledTimes(1); // Still only called once
    expect(result2).toBe('first call'); // Returns the previous result
  });
  
  it('should execute the function after wait period elapses', () => {
    const func = jest.fn()
      .mockImplementationOnce(() => 'first call')
      .mockImplementationOnce(() => 'second call');
    
    const throttled = throttle(func, 100);
    
    // First call
    const result1 = throttled();
    expect(func).toHaveBeenCalledTimes(1);
    expect(result1).toBe('first call');
    
    // Call within wait period
    jest.advanceTimersByTime(50);
    const result2 = throttled();
    expect(func).toHaveBeenCalledTimes(1); // Still only called once
    expect(result2).toBe('first call');
    
    // Advance time past the wait period
    jest.advanceTimersByTime(50);
    
    // The scheduled callback should have executed
    expect(func).toHaveBeenCalledTimes(2);
  });
  
  it('should execute the function immediately after wait period has fully elapsed', () => {
    const func = jest.fn()
      .mockImplementationOnce(() => 'first call')
      .mockImplementationOnce(() => 'second call')
      .mockImplementationOnce(() => 'third call');
    
    const throttled = throttle(func, 100);
    
    // First call
    throttled();
    expect(func).toHaveBeenCalledTimes(1);
    
    // Advance time fully past the wait period
    jest.advanceTimersByTime(100);
    
    // Call again after wait period - should execute immediately
    const result2 = throttled();
    expect(func).toHaveBeenCalledTimes(2);
    expect(result2).toBe('second call');
  });
  
  it('should cancel delayed execution', () => {
    const func = jest.fn()
      .mockImplementationOnce(() => 'first call')
      .mockImplementationOnce(() => 'second call');
    
    const throttled = throttle(func, 100);
    
    // First call
    throttled();
    expect(func).toHaveBeenCalledTimes(1);
    
    // Call within wait period - this schedules a delayed execution
    jest.advanceTimersByTime(50);
    throttled();
    expect(func).toHaveBeenCalledTimes(1);
    
    // Cancel the throttled function
    throttled.cancel();
    
    // Advance time past the wait period
    jest.advanceTimersByTime(50);
    
    // The scheduled callback should not have executed
    expect(func).toHaveBeenCalledTimes(1);
    
    // Call again - should execute immediately because we cancelled
    throttled();
    expect(func).toHaveBeenCalledTimes(2);
  });
  
  it('should maintain the correct this context', () => {
    const obj = {
      value: 'test',
      method: function(suffix: string) {
        return this.value + suffix;
      }
    };
    
    const throttled = throttle(obj.method, 100);
    const result = throttled.call(obj, '-suffix');
    expect(result).toBe('test-suffix');
  });
});
