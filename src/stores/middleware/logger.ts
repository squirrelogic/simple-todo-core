import { StateCreator } from 'zustand';
import { MiddlewareConfig } from './types';

interface LoggerConfig<T> extends MiddlewareConfig {
  collapsed?: boolean;
  diff?: boolean;
  predicate?: (state: T, prevState: T) => boolean;
}

export const logger = <T extends object>(
  config: LoggerConfig<T> = {}
) => (
  f: StateCreator<T, [], []>
): StateCreator<T, [], []> => (set, get, api) => {
  const { 
    name = 'zustand', 
    collapsed = true, 
    diff = true,
    predicate,
    enabled = process.env.NODE_ENV === 'development'
  } = config;

  const enhancedSet: typeof set = (partial, replace) => {
    if (!enabled) {
      set(partial, replace);
      return;
    }

    const prevState = get();
    
    // Apply the state change first
    set(partial, replace);
    
    // Get the new state after the change
    const nextState = get();
    
    // Apply predicate if provided
    if (predicate && !predicate(nextState, prevState)) {
      return;
    }

    // Log group
    const groupMethod = collapsed ? console.groupCollapsed : console.group;
    groupMethod(`${name} @ ${new Date().toLocaleTimeString()}`);
    
    console.log('%c prev state', 'color: #9E9E9E; font-weight: bold', prevState);
    console.log('%c next state', 'color: #4CAF50; font-weight: bold', nextState);
    
    if (diff && prevState && nextState && typeof prevState === 'object' && typeof nextState === 'object') {
      const changes: Record<string, { prev: unknown; next: unknown }> = {};
      const allKeys = new Set([...Object.keys(prevState), ...Object.keys(nextState)]);
      
      allKeys.forEach(key => {
        if (prevState[key as keyof T] !== nextState[key as keyof T]) {
          changes[key] = {
            prev: prevState[key as keyof T],
            next: nextState[key as keyof T]
          };
        }
      });
      
      if (Object.keys(changes).length > 0) {
        console.log('%c diff', 'color: #2196F3; font-weight: bold', changes);
      }
    }
    
    console.groupEnd();
  };

  return f(enhancedSet, get, api);
};