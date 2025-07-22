import { create } from 'zustand';
import { logger } from '../logger';

interface TestState {
  count: number;
  name: string;
  increment: () => void;
  setName: (name: string) => void;
}

describe('logger middleware', () => {
  let consoleSpy: {
    group: jest.SpyInstance;
    groupCollapsed: jest.SpyInstance;
    log: jest.SpyInstance;
    groupEnd: jest.SpyInstance;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = {
      group: jest.spyOn(console, 'group').mockImplementation(),
      groupCollapsed: jest.spyOn(console, 'groupCollapsed').mockImplementation(),
      log: jest.spyOn(console, 'log').mockImplementation(),
      groupEnd: jest.spyOn(console, 'groupEnd').mockImplementation(),
    };
  });

  afterEach(() => {
    consoleSpy.group.mockRestore();
    consoleSpy.groupCollapsed.mockRestore();
    consoleSpy.log.mockRestore();
    consoleSpy.groupEnd.mockRestore();
  });

  it('should log state changes in development', () => {
    const useStore = create<TestState>()(
      logger<TestState>({
        enabled: true,
      })((set) => ({
        count: 0,
        name: 'test',
        increment: () => set((state) => ({ count: state.count + 1 })),
        setName: (name) => set({ name }),
      }))
    );

    const { increment } = useStore.getState();
    
    increment();
    
    expect(consoleSpy.groupCollapsed).toHaveBeenCalled();
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('prev state'),
      expect.any(String),
      expect.objectContaining({ count: 0 })
    );
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('next state'),
      expect.any(String),
      expect.objectContaining({ count: 1 })
    );
    expect(consoleSpy.groupEnd).toHaveBeenCalled();
  });

  it('should show diff when enabled', () => {
    const useStore = create<TestState>()(
      logger<TestState>({
        enabled: true,
        diff: true,
      })((set) => ({
        count: 0,
        name: 'test',
        increment: () => set((state) => ({ count: state.count + 1 })),
        setName: (name) => set({ name }),
      }))
    );

    const { setName } = useStore.getState();
    
    setName('updated');
    
    expect(consoleSpy.log).toHaveBeenCalledWith(
      expect.stringContaining('diff'),
      expect.any(String),
      expect.objectContaining({
        name: { prev: 'test', next: 'updated' }
      })
    );
  });

  it('should use predicate when provided', () => {
    const predicate = jest.fn().mockReturnValue(false);
    
    const useStore = create<TestState>()(
      logger<TestState>({
        enabled: true,
        predicate,
      })((set) => ({
        count: 0,
        name: 'test',
        increment: () => set((state) => ({ count: state.count + 1 })),
        setName: (name) => set({ name }),
      }))
    );

    const { increment } = useStore.getState();
    
    increment();
    
    expect(predicate).toHaveBeenCalled();
    expect(consoleSpy.groupCollapsed).not.toHaveBeenCalled();
  });

  it('should not log when disabled', () => {
    const useStore = create<TestState>()(
      logger<TestState>({
        enabled: false,
      })((set) => ({
        count: 0,
        name: 'test',
        increment: () => set((state) => ({ count: state.count + 1 })),
        setName: (name) => set({ name }),
      }))
    );

    const { increment } = useStore.getState();
    
    increment();
    
    expect(consoleSpy.groupCollapsed).not.toHaveBeenCalled();
    expect(consoleSpy.log).not.toHaveBeenCalled();
  });

  it('should use expanded groups when collapsed is false', () => {
    const useStore = create<TestState>()(
      logger<TestState>({
        enabled: true,
        collapsed: false,
      })((set) => ({
        count: 0,
        name: 'test',
        increment: () => set((state) => ({ count: state.count + 1 })),
        setName: (name) => set({ name }),
      }))
    );

    const { increment } = useStore.getState();
    
    increment();
    
    expect(consoleSpy.group).toHaveBeenCalled();
    expect(consoleSpy.groupCollapsed).not.toHaveBeenCalled();
  });
});