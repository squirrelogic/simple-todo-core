'use client';

import React, { useState, useEffect } from 'react';
import { useTodoStore } from '@/stores/todos/todo-store';

/**
 * Debug panel for development - shows store state and metrics
 * Only renders in development mode
 */
export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<{
    completionRate: string;
    averageAge: number;
    oldestTodo: string | null;
    newestTodo: string | null;
  } | null>(null);
  const todos = useTodoStore((state) => state.todos);
  const filter = useTodoStore((state) => state.filter);
  const error = useTodoStore((state) => state.error);
  const isLoading = useTodoStore((state) => state.isLoading);

  useEffect(() => {
    if (isOpen) {
      const inspector = (window as Window & { __todoStoreInspector?: { getMetrics: () => typeof metrics } }).__todoStoreInspector;
      if (inspector) {
        setMetrics(inspector.getMetrics());
      }
    }
  }, [isOpen, todos]);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const exportState = () => {
    const inspector = (window as Window & { __todoStoreInspector?: { exportState: () => string } }).__todoStoreInspector;
    if (inspector) {
      const data = inspector.exportState();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `todo-state-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors text-sm font-mono"
          aria-label="Open debug panel"
        >
          🐛 Debug
        </button>
      ) : (
        <div className="bg-gray-800 text-white rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold font-mono">Debug Panel</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
              aria-label="Close debug panel"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 font-mono text-sm">
            {/* State Overview */}
            <div>
              <h4 className="font-bold mb-2">State Overview</h4>
              <div className="bg-gray-700 rounded p-2 space-y-1">
                <div>Todos: {todos.length}</div>
                <div>Filter: {filter}</div>
                <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
                <div>Error: {error || 'None'}</div>
              </div>
            </div>

            {/* Metrics */}
            {metrics && (
              <div>
                <h4 className="font-bold mb-2">Metrics</h4>
                <div className="bg-gray-700 rounded p-2 space-y-1">
                  <div>Completion Rate: {metrics.completionRate}</div>
                  <div>Avg Age: {metrics.averageAge.toFixed(1)}h</div>
                  <div>Oldest: {metrics.oldestTodo ? new Date(metrics.oldestTodo).toLocaleDateString() : 'N/A'}</div>
                  <div>Newest: {metrics.newestTodo ? new Date(metrics.newestTodo).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div>
              <h4 className="font-bold mb-2">Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={exportState}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors"
                >
                  Export State
                </button>
                <button
                  onClick={() => {
                    const inspector = (window as Window & { __todoStoreInspector?: { logState: (label: string) => void } }).__todoStoreInspector;
                    if (inspector) {
                      inspector.logState('Debug Panel Log');
                    }
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition-colors"
                >
                  Log to Console
                </button>
              </div>
            </div>

            {/* Raw State Preview */}
            <div>
              <h4 className="font-bold mb-2">Raw State (First 3 Todos)</h4>
              <pre className="bg-gray-700 rounded p-2 text-xs overflow-x-auto">
                {JSON.stringify(todos.slice(0, 3), null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}