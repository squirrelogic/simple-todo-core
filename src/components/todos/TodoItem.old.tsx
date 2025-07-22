'use client';

import { useState, useRef, useEffect, KeyboardEvent, memo } from 'react';
import { TodoItem as TodoItemType } from '@/types/todo';
import { useTodoStore } from '@/stores/todos/todo-store';
import { TODO_TEXT_MAX_LENGTH } from '@/lib/validation/todo';
import { useConfirmation } from '@/hooks/useConfirmation';
import { EditIcon, DeleteIcon } from '@/components/icons/TodoIcons';

interface TodoItemProps {
  todo: TodoItemType;
  onFocus?: (todoId: string) => void;
}

function TodoItemComponent({ todo, onFocus }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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
    setEditError(null);
  };

  const handleSaveEdit = async () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      setIsSaving(true);
      setEditError(null);
      
      const result = await updateTodo(todo.id, trimmedText);
      
      if (result.success) {
        setIsEditing(false);
      } else {
        setEditError(result.error || 'Failed to update todo');
      }
      
      setIsSaving(false);
    } else {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setIsEditing(false);
    setEditError(null);
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
        <div className="flex-1">
          <input
            ref={editInputRef}
            type="text"
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);
              setEditError(null);
            }}
            onBlur={handleSaveEdit}
            onKeyDown={handleEditKeyDown}
            maxLength={TODO_TEXT_MAX_LENGTH}
            className={`w-full px-2 py-1 text-base border rounded focus:outline-none focus:ring-2 ${
              editError 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-blue-500 focus:ring-blue-500'
            } ${isSaving ? 'opacity-50' : ''}`}
            aria-label="Edit todo text"
            aria-invalid={!!editError}
            aria-describedby={editError ? `edit-error-${todo.id}` : undefined}
            disabled={isSaving}
          />
          {editError && (
            <p
              id={`edit-error-${todo.id}`}
              className="mt-1 text-xs text-red-600"
              role="alert"
            >
              {editError}
            </p>
          )}
        </div>
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
            <EditIcon />
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
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}

export const TodoItem = memo(TodoItemComponent);