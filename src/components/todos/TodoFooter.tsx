'use client';

import { useState } from 'react';
import { useTodoStore } from '@/stores/todos/todo-store';

export function TodoFooter() {
  const stats = useTodoStore((state) => state.getStats());
  const clearCompleted = useTodoStore((state) => state.clearCompleted);
  const toggleAll = useTodoStore((state) => state.toggleAll);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearCompleted = () => {
    if (showClearConfirm) {
      clearCompleted();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      // Auto-cancel after 3 seconds
      setTimeout(() => setShowClearConfirm(false), 3000);
    }
  };

  if (stats.total === 0) {
    return null;
  }

  const itemsLeftText = `${stats.active} ${stats.active === 1 ? 'item' : 'items'} left`;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-600" aria-live="polite">
        {itemsLeftText}
      </span>
      
      <div className="flex items-center gap-2">
        {stats.total > 0 && (
          <button
            onClick={toggleAll}
            className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            aria-label={`Mark all todos as ${stats.active === 0 ? 'incomplete' : 'complete'}`}
          >
            {stats.active === 0 ? 'Mark all active' : 'Mark all complete'}
          </button>
        )}
        
        {stats.completed > 0 && (
          <button
            onClick={handleClearCompleted}
            className={`px-3 py-1 text-sm transition-colors ${
              showClearConfirm
                ? 'text-red-600 hover:text-red-700 font-medium'
                : 'text-gray-700 hover:text-gray-900'
            }`}
            aria-label={
              showClearConfirm
                ? `Confirm clear ${stats.completed} completed ${stats.completed === 1 ? 'todo' : 'todos'}`
                : `Clear ${stats.completed} completed ${stats.completed === 1 ? 'todo' : 'todos'}`
            }
          >
            {showClearConfirm ? 'Confirm clear?' : 'Clear completed'}
          </button>
        )}
      </div>
    </div>
  );
}