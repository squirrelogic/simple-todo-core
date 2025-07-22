'use client';

import React, { useRef, useEffect, KeyboardEvent } from 'react';
import { TODO_TEXT_MAX_LENGTH } from '@/lib/validation/todo';

interface TodoTextProps {
  text: string;
  completed: boolean;
  isEditing: boolean;
  editText: string;
  editError?: string | null;
  isSaving?: boolean;
  onEditTextChange: (text: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onStartEdit: () => void;
  todoId: string;
}

export function TodoText({
  text,
  completed,
  isEditing,
  editText,
  editError,
  isSaving,
  onEditTextChange,
  onSave,
  onCancel,
  onStartEdit,
  todoId,
}: TodoTextProps) {
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex-1">
        <input
          ref={editInputRef}
          type="text"
          value={editText}
          onChange={(e) => onEditTextChange(e.target.value)}
          onBlur={onSave}
          onKeyDown={handleEditKeyDown}
          maxLength={TODO_TEXT_MAX_LENGTH}
          className={`w-full px-2 py-1 text-base border rounded focus:outline-none focus:ring-2 ${
            editError 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-blue-500 focus:ring-blue-500'
          } ${isSaving ? 'opacity-50' : ''}`}
          aria-label="Edit todo text"
          aria-invalid={!!editError}
          aria-describedby={editError ? `edit-error-${todoId}` : undefined}
          disabled={isSaving}
        />
        {editError && (
          <p
            id={`edit-error-${todoId}`}
            className="mt-1 text-xs text-red-600"
            role="alert"
          >
            {editError}
          </p>
        )}
      </div>
    );
  }

  return (
    <span
      className={`flex-1 text-base cursor-pointer ${
        completed ? 'line-through text-gray-500' : 'text-gray-800'
      }`}
      onDoubleClick={onStartEdit}
    >
      {text}
    </span>
  );
}