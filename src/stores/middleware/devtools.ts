import { StateCreator } from 'zustand';
import { devtools as zustandDevtools } from 'zustand/middleware';
import { MiddlewareConfig } from './types';

interface DevtoolsConfig extends MiddlewareConfig {
  anonymousActionType?: string;
  trace?: boolean;
}

export const devtools = <T extends object>(
  config: DevtoolsConfig = {}
) => (
  f: StateCreator<T, [], []>
): StateCreator<T, [], []> => {
  const { 
    name = 'TodoStore',
    enabled = process.env.NODE_ENV === 'development',
    anonymousActionType,
    trace
  } = config;

  if (!enabled || typeof window === 'undefined') {
    return f;
  }

  return zustandDevtools(f, {
    name,
    anonymousActionType,
    trace,
  }) as StateCreator<T, [], []>;
};