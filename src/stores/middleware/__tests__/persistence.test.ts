import { create } from 'zustand';
import { persistence } from '../persistence';

interface TestState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

describe('persistence middleware', () => {
  let mockPersist: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockPersist = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should persist state after changes', () => {
    const useStore = create<TestState>()(
      persistence<TestState>({
        persist: mockPersist,
      })((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
      }))
    );

    const { increment } = useStore.getState();
    
    increment();
    
    expect(mockPersist).toHaveBeenCalledWith(
      expect.objectContaining({ count: 1 })
    );
  });

  it('should debounce persistence when configured', () => {
    const useStore = create<TestState>()(
      persistence<TestState>({
        persist: mockPersist,
        debounceMs: 1000,
      })((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
      }))
    );

    const { increment } = useStore.getState();
    
    // Multiple rapid updates
    increment();
    increment();
    increment();
    
    // Should not persist immediately
    expect(mockPersist).not.toHaveBeenCalled();
    
    // Fast forward time
    jest.advanceTimersByTime(1000);
    
    // Should persist once with final state
    expect(mockPersist).toHaveBeenCalledTimes(1);
    expect(mockPersist).toHaveBeenCalledWith(
      expect.objectContaining({ count: 3 })
    );
  });

  it('should not persist when disabled', () => {
    const useStore = create<TestState>()(
      persistence<TestState>({
        persist: mockPersist,
        enabled: false,
      })((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
      }))
    );

    const { increment } = useStore.getState();
    
    increment();
    
    expect(mockPersist).not.toHaveBeenCalled();
  });

  it('should handle persist errors gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockErrorPersist = jest.fn().mockImplementation(() => {
      throw new Error('Storage full');
    });

    const useStore = create<TestState>()(
      persistence<TestState>({
        persist: mockErrorPersist,
      })((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
      }))
    );

    const { increment } = useStore.getState();
    
    // Should not throw when persist fails
    expect(() => increment()).not.toThrow();
    expect(mockErrorPersist).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Persistence error:',
      expect.any(Error)
    );
    
    consoleErrorSpy.mockRestore();
  });
});