'use client';

import { useState, useRef, useEffect, KeyboardEvent, memo } from 'react';
import { TodoItem as TodoItemType } from '@/types/todo';
import { useTodoStore } from '@/stores/todos/todo-store';
import { TODO_TEXT_MAX_LENGTH } from '@/lib/validation/todo';
import { useConfirmation } from '@/hooks/useConfirmation';

interface TodoItemProps {
  todo: TodoItemType;
  onFocus?: (todoId: string) => void;
}

function TodoItemComponent({ todo, onFocus }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const {
    showConfirmation: showDeleteConfirm,
    requestConfirmation: requestDeleteConfirmation,
    confirm: confirmDelete,
  } = useConfirmation({
    onConfirm: () => deleteTodo(todo.id),
  });
  
  const { toggleTodo, updateTodo, deleteTodo } = useTodoStore();

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSaveEdit = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      updateTodo(todo.id, trimmedText);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      confirmDelete();
    } else {
      requestDeleteConfirmation();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isEditing) {
      if (e.key === ' ') {
        e.preventDefault();
        toggleTodo(todo.id);
      } else if (e.key === 'Delete') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleStartEdit();
      }
    }
  };

  return (
    <div
      className="group flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      role="listitem"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => onFocus?.(todo.id)}
      aria-label={`Todo: ${todo.text}, ${todo.completed ? 'completed' : 'active'}`}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={handleEditKeyDown}
          maxLength={TODO_TEXT_MAX_LENGTH}
          className="flex-1 px-2 py-1 text-base border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Edit todo text"
        />
      ) : (
        <span
          className={`flex-1 text-base cursor-pointer ${
            todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
          }`}
          onDoubleClick={handleStartEdit}
        >
          {todo.text}
        </span>
      )}
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <button
            onClick={handleStartEdit}
            className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
            aria-label={`Edit "${todo.text}"`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
        
        <button
          onClick={handleDelete}
          className={`p-1 transition-colors ${
            showDeleteConfirm
              ? 'text-red-600 hover:text-red-700'
              : 'text-gray-600 hover:text-red-600'
          }`}
          aria-label={showDeleteConfirm ? `Confirm delete "${todo.text}"` : `Delete "${todo.text}"`}
        >
          {showDeleteConfirm ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export const TodoItem = memo(TodoItemComponent);