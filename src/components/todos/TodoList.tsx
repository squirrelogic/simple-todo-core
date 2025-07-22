'use client';

import { useEffect } from 'react';
import { useTodoStore } from '@/stores/todos/todo-store';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const todos = useTodoStore((state) => state.getFilteredTodos()) || [];
  const filter = useTodoStore((state) => state.filter);
  const isLoading = useTodoStore((state) => state.isLoading);
  const loadTodos = useTodoStore((state) => state.loadTodos);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    const emptyMessage = {
      all: 'No todos yet. Add one above!',
      active: 'No active todos. Great job!',
      completed: 'No completed todos yet.',
    };

    return (
      <div className="text-center py-8 text-gray-500">
        <p>{emptyMessage[filter]}</p>
      </div>
    );
  }

  return (
    <div
      className="space-y-2"
      role="list"
      aria-label={`${filter} todos list`}
      aria-live="polite"
    >
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}