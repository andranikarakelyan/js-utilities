import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  it('should not execute the function immediately on first call', () => {
    const func = jest.fn().mockReturnValue('result');
    const debounced = debounce(func, 100);
    
    const result = debounced();
    expect(func).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
  
  it('should execute the function after wait period elapses', () => {
    const func = jest.fn().mockReturnValue('result');
    const debounced = debounce(func, 100);
    
    debounced();
    expect(func).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });
  
  it('should reset the timer on subsequent calls within wait period', () => {
    const func = jest.fn().mockReturnValue('result');
    const debounced = debounce(func, 100);
    
    debounced();
    expect(func).not.toHaveBeenCalled();
    
    // Advance time but not completely
    jest.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();
    
    // Call again
    debounced();
    
    // Advance time to where the first call would have executed
    jest.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled(); // Still not called due to the reset
    
    // Complete the wait period for the second call
    jest.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
  });
  
  it('should cancel delayed timer', () => {
    const func = jest.fn().mockReturnValue('result');
    const debounced = debounce(func, 100);
    
    debounced();
    expect(func).not.toHaveBeenCalled();
    
    debounced.cancel();
    
    // Advance time
    jest.advanceTimersByTime(100);
    expect(func).not.toHaveBeenCalled(); // Should not be called because timer was cancelled
  });
  
  it('should maintain the correct this context and arguments', () => {
    const obj = {
      value: 'test',
      method: function(suffix: string) {
        return this.value + suffix;
      }
    };
    
    const spy = jest.spyOn(obj, 'method');
    const debounced = debounce(obj.method, 100);
    
    debounced.call(obj, '-suffix');
    expect(spy).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledWith('-suffix');
    expect(spy).toHaveBeenCalledTimes(1);
  });
  
  it('should invoke with the latest arguments after multiple calls', () => {
    const func = jest.fn();
    const debounced = debounce(func, 100);
    
    debounced('first');
    debounced('second');
    debounced('third');
    
    expect(func).not.toHaveBeenCalled();
    
    jest.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('third'); // Only called with the last arguments
  });
});
