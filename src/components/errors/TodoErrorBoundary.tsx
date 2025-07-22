'use client';

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { useTodoStore } from '@/stores/todos/todo-store';

interface TodoErrorBoundaryProps {
  children: React.ReactNode;
}

export function TodoErrorBoundary({ children }: TodoErrorBoundaryProps) {
  const loadTodos = useTodoStore((state) => state.loadTodos);

  const handleError = (error: Error) => {
    // Log todo-specific errors
    console.error('Todo feature error:', error);
    
    // Could send to error monitoring service here
    // errorReporter.logError(error, { feature: 'todos' });
  };

  const fallback = (error: Error, reset: () => void) => {
    const isStorageError = error.message.toLowerCase().includes('storage');
    const isNetworkError = error.message.toLowerCase().includes('network');

    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Todo List Error
          </h2>
          
          <p className="text-gray-600 mb-6">
            {isStorageError && 'Unable to save or load your todos. Please check your browser storage settings.'}
            {isNetworkError && 'Network error. Please check your connection and try again.'}
            {!isStorageError && !isNetworkError && 'An error occurred while managing your todos.'}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => {
                reset();
                loadTodos(); // Reload todos after reset
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Reload todos"
            >
              Reload Todos
            </button>
            
            {isStorageError && (
              <button
                onClick={() => {
                  localStorage.clear();
                  reset();
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                aria-label="Clear storage and retry"
              >
                Clear Storage & Retry
              </button>
            )}
          </div>

          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Technical details
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-auto">
              {error.stack || error.message}
            </pre>
          </details>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}