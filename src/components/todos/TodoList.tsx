'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTodoStore } from '@/stores/todos/todo-store';
import { TodoItem } from './TodoItem';

export function TodoList() {
  const todos = useTodoStore((state) => state.getFilteredTodos()) || [];
  const filter = useTodoStore((state) => state.filter);
  const isLoading = useTodoStore((state) => state.isLoading);
  const loadTodos = useTodoStore((state) => state.loadTodos);
  const listRef = useRef<HTMLDivElement>(null);
  const focusedIdRef = useRef<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Track focused todo
  const handleFocus = useCallback((todoId: string) => {
    focusedIdRef.current = todoId;
  }, []);

  // Restore focus after deletion
  useEffect(() => {
    if (focusedIdRef.current && listRef.current) {
      const todoIds = todos.map(t => t.id);
      const focusedIndex = todoIds.indexOf(focusedIdRef.current);
      
      // If the focused todo was deleted, focus the next or previous item
      if (focusedIndex === -1 && todos.length > 0) {
        const todoItems = listRef.current.querySelectorAll('[role="listitem"]');
        const targetIndex = Math.min(todoIds.length - 1, 0);
        const targetItem = todoItems[targetIndex] as HTMLElement;
        
        if (targetItem) {
          targetItem.focus();
          focusedIdRef.current = todos[targetIndex]?.id || null;
        }
      }
    }
  }, [todos]);

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
      ref={listRef}
      className="space-y-2"
      role="list"
      aria-label={`${filter} todos list`}
      aria-live="polite"
    >
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onFocus={handleFocus} />
      ))}
    </div>
  );
}