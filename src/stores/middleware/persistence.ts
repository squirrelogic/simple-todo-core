import { StateCreator } from 'zustand';
import { MiddlewareConfig } from './types';

interface PersistenceConfig<T> extends MiddlewareConfig {
  persist: (state: T) => void;
  debounceMs?: number;
}

export const persistence = <T extends object>(
  config: PersistenceConfig<T>
) => (
  f: StateCreator<T, [], []>
): StateCreator<T, [], []> => (set, get, api) => {
  let timeoutId: NodeJS.Timeout | null = null;
  const { persist, debounceMs = 0, enabled = true } = config;

  const persistState = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const doPersist = () => {
      try {
        persist(get());
      } catch (error) {
        console.error('Persistence error:', error);
      }
    };

    if (debounceMs > 0) {
      timeoutId = setTimeout(doPersist, debounceMs);
    } else {
      doPersist();
    }
  };

  const enhancedSet: typeof set = (partial, replace) => {
    // Get the previous state
    const prevState = get();
    
    // Apply the state update
    set(partial, replace);
    
    // Get the new state
    const newState = get();
    
    // Check if we should persist
    if (enabled && prevState !== newState) {
      // In production, we might want to check which action was called
      // For now, we'll persist on every state change
      persistState();
    }
  };

  // Initialize the store with the enhanced set function
  const store = f(enhancedSet, get, api);
  
  return store;
};