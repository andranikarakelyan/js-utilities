import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  it('should execute the function immediately on first call', () => {
    const func = jest.fn().mockReturnValue('result');
    const debounced = debounce(func, 100);
    
    const result = debounced();
    expect(func).toHaveBeenCalledTimes(1);
    expect(result).toBe('result');
  });
  
  it('should not execute function on subsequent calls within wait period', () => {
    const func = jest.fn().mockReturnValue('first call');
    const debounced = debounce(func, 100);
    
    const result1 = debounced();
    expect(func).toHaveBeenCalledTimes(1);
    expect(result1).toBe('first call');
    
    const result2 = debounced();
    expect(func).toHaveBeenCalledTimes(1); // Still only called once
    expect(result2).toBe('first call'); // Returns the previous result
  });
  
  it('should execute the function after wait period elapses', () => {
    const func = jest.fn()
      .mockImplementationOnce(() => 'first call')
      .mockImplementationOnce(() => 'second call');
    
    const debounced = debounce(func, 100);
    
    // First call
    const result1 = debounced();
    expect(func).toHaveBeenCalledTimes(1);
    expect(result1).toBe('first call');
    
    // Call within wait period
    const result2 = debounced();
    expect(func).toHaveBeenCalledTimes(1); // Still only called once
    expect(result2).toBe('first call');
    
    // Advance time to clear the timeout
    jest.advanceTimersByTime(100);
    
    // Call after wait period
    const result3 = debounced();
    expect(func).toHaveBeenCalledTimes(2); // Called again
    expect(result3).toBe('second call');
  });
  
  it('should cancel delayed timer', () => {
    const func = jest.fn().mockReturnValue('result');
    const debounced = debounce(func, 100);
    
    debounced();
    expect(func).toHaveBeenCalledTimes(1);
    
    debounced.cancel();
    
    // Advance time
    jest.advanceTimersByTime(100);
    
    // Call again - should execute because the timer was cancelled
    func.mockReturnValueOnce('new result');
    const result = debounced();
    expect(func).toHaveBeenCalledTimes(2);
    expect(result).toBe('new result');
  });
  
  it('should maintain the correct this context', () => {
    const obj = {
      value: 'test',
      method: function(suffix: string) {
        return this.value + suffix;
      }
    };
    
    const debounced = debounce(obj.method, 100);
    const result = debounced.call(obj, '-suffix');
    expect(result).toBe('test-suffix');
  });
});
