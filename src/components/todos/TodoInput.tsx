'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { useTodoStore } from '@/stores/todos/todo-store';
import { TODO_TEXT_MAX_LENGTH } from '@/lib/validation/todo';

const CHARACTER_WARNING_THRESHOLD = 20;

export function TodoInput() {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const addTodo = useTodoStore((state) => state.addTodo);
  const storeError = useTodoStore((state) => state.error);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setError('Please enter a todo');
      return;
    }

    addTodo(inputValue);
    
    // Clear input if successful (no store error)
    if (!storeError) {
      setInputValue('');
      setError(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setInputValue('');
      setError(null);
    }
  };

  const displayError = error || storeError;
  const remainingChars = TODO_TEXT_MAX_LENGTH - inputValue.length;
  const isNearLimit = remainingChars <= CHARACTER_WARNING_THRESHOLD;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 pr-20 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={TODO_TEXT_MAX_LENGTH}
          aria-label="New todo input"
          aria-invalid={!!displayError}
          aria-describedby={displayError ? 'todo-input-error' : undefined}
        />
        {inputValue && (
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
              isNearLimit ? 'text-orange-500' : 'text-gray-400'
            }`}
            aria-live="polite"
            aria-label={`${remainingChars} characters remaining`}
          >
            {remainingChars}
          </span>
        )}
      </div>
      {displayError && (
        <p
          id="todo-input-error"
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {displayError}
        </p>
      )}
    </form>
  );
}