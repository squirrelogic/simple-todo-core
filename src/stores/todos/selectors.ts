import { useMemo } from 'react';
import { useTodoStore } from './todo-store';
import { applyFilter, getTodoStats } from '@/lib/utils/todo-filters';

/**
 * Memoized selector for filtered todos
 * @returns {TodoItem[]} Array of todos filtered by current filter
 * @example
 * const todos = useFilteredTodos();
 * // Returns todos based on current filter (all/active/completed)
 */
export const useFilteredTodos = () => {
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  
  return useMemo(() => applyFilter(todos, filter), [todos, filter]);
};

/**
 * Memoized selector for todo statistics
 * @returns {{ total: number, active: number, completed: number }} Todo counts
 * @example
 * const stats = useTodoStats();
 * console.log(`${stats.active} todos remaining`);
 */
export const useTodoStats = () => {
  const todos = useTodoStore((state) => state.todos);
  
  return useMemo(() => getTodoStats(todos), [todos]);
};

/**
 * Memoized selector for active todos count
 * @returns {number} Number of incomplete todos
 */
export const useActiveTodosCount = () => {
  const todos = useTodoStore((state) => state.todos);
  
  return useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);
};

/**
 * Memoized selector for completed todos count  
 * @returns {number} Number of completed todos
 */
export const useCompletedTodosCount = () => {
  const todos = useTodoStore((state) => state.todos);
  
  return useMemo(() => todos.filter(todo => todo.completed).length, [todos]);
};

/**
 * Memoized selector for checking if all todos are completed
 * @returns {boolean} True if all todos are completed, false otherwise
 */
export const useAllTodosCompleted = () => {
  const todos = useTodoStore((state) => state.todos);
  
  return useMemo(() => todos.length > 0 && todos.every(todo => todo.completed), [todos]);
};

/**
 * Memoized selector for checking if there are any completed todos
 * @returns {boolean} True if at least one todo is completed
 */
export const useHasCompletedTodos = () => {
  const todos = useTodoStore((state) => state.todos);
  
  return useMemo(() => todos.some(todo => todo.completed), [todos]);
};