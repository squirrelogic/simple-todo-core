import { TodoItem, FilterType } from '@/types/todo';

export const todoFilters = {
  all: (todos: TodoItem[]) => todos || [],
  active: (todos: TodoItem[]) => (todos || []).filter(todo => !todo.completed),
  completed: (todos: TodoItem[]) => (todos || []).filter(todo => todo.completed)
} as const;

export const applyFilter = (todos: TodoItem[], filter: FilterType): TodoItem[] => {
  return todoFilters[filter](todos || []);
};

export const getTodoStats = (todos: TodoItem[]) => {
  const safeTodos = todos || [];
  const total = safeTodos.length;
  const completed = safeTodos.filter(todo => todo.completed).length;
  const active = total - completed;
  
  return {
    total,
    completed,
    active
  };
};