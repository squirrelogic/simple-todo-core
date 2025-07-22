import { StateCreator } from 'zustand';
import { MiddlewareConfig } from './types';

interface PersistenceConfig<T> extends MiddlewareConfig {
  persist: (state: T) => void;
  debounceMs?: number;
}

/**
 * Persistence middleware for Zustand stores
 * Automatically persists state changes with optional debouncing
 * 
 * @template T - The store state type
 * @param {PersistenceConfig<T>} config - Persistence configuration
 * @param {(state: T) => void} config.persist - Function to persist state
 * @param {number} [config.debounceMs=0] - Debounce delay in milliseconds
 * @param {boolean} [config.enabled=true] - Whether persistence is enabled
 * @returns {Middleware} Zustand middleware function
 * 
 * @example
 * const store = create(
 *   persistence({
 *     persist: (state) => localStorage.setItem('key', JSON.stringify(state)),
 *     debounceMs: 500
 *   })((set) => ({
 *     // ... store implementation
 *   }))
 * );
 */
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