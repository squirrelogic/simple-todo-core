'use client';

import { useState, FormEvent, KeyboardEvent } from 'react';
import { useTodoStore } from '@/stores/todos/todo-store';
import { TODO_TEXT_MAX_LENGTH } from '@/lib/validation/todo';

const CHARACTER_WARNING_THRESHOLD = 20;

export function TodoInput() {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setError('Please enter a todo');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await addTodo(inputValue);
    
    if (result.success) {
      setInputValue('');
      setError(null);
    } else {
      setError(result.error || 'Failed to add todo');
    }

    setIsSubmitting(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setInputValue('');
      setError(null);
    }
  };

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
          className="w-full px-4 py-3 pr-20 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          maxLength={TODO_TEXT_MAX_LENGTH}
          aria-label="New todo input"
          aria-invalid={!!error}
          aria-describedby={error ? 'todo-input-error' : undefined}
          disabled={isSubmitting}
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
      {error && (
        <p
          id="todo-input-error"
          className="mt-1 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </form>
  );
}