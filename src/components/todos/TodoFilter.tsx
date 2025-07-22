'use client';

import React from 'react';
import { FilterType } from '@/types/todo';
import { useTodoStore } from '@/stores/todos/todo-store';

export const TodoFilter = React.memo(function TodoFilter() {
  const filter = useTodoStore((state) => state.filter);
  const setFilter = useTodoStore((state) => state.setFilter);
  const stats = useTodoStore((state) => state.getStats());

  const filters: { value: FilterType; label: string; count?: number }[] = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'active', label: 'Active', count: stats.active },
    { value: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Filter todos">
      {filters.map(({ value, label, count }) => (
        <button
          key={value}
          onClick={() => setFilter(value)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            filter === value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          role="tab"
          aria-selected={filter === value}
          aria-controls="todo-list"
          aria-label={`Show ${label} todos (${count})`}
        >
          {label}
          {count !== undefined && (
            <span className="ml-1">({count})</span>
          )}
        </button>
      ))}
    </div>
  );
});