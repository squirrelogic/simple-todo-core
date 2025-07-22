import { StateCreator } from 'zustand';

type AnyMiddleware = <T extends object>(
  config: StateCreator<T, [], []>
) => StateCreator<T, [], []>;

export function compose<T extends object>(
  ...middlewares: AnyMiddleware[]
): (config: StateCreator<T, [], []>) => StateCreator<T, [], []> {
  return (config) =>
    middlewares.reduceRight(
      (acc, middleware) => middleware(acc),
      config
    );
}