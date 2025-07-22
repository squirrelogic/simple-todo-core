import { StateCreator, StoreMutatorIdentifier } from 'zustand';

export type Middleware<
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
> = (
  config: StateCreator<T, Mps, Mcs>,
  options?: unknown
) => StateCreator<T, Mps, Mcs>;

export interface MiddlewareConfig {
  name?: string;
  enabled?: boolean;
}