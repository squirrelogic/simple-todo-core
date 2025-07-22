'use client';

import React from 'react';
import { EditIcon, DeleteIcon } from '@/components/icons/TodoIcons';

interface TodoActionsProps {
  isEditing: boolean;
  showDeleteConfirm: boolean;
  onEdit: () => void;
  onDelete: () => void;
  todoText: string;
}

export const TodoActions = React.memo(function TodoActions({
  isEditing,
  showDeleteConfirm,
  onEdit,
  onDelete,
  todoText,
}: TodoActionsProps) {
  return (
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {!isEditing && (
        <button
          onClick={onEdit}
          className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label={`Edit "${todoText}"`}
        >
          <EditIcon />
        </button>
      )}
      
      <button
        onClick={onDelete}
        className={`p-1 transition-colors ${
          showDeleteConfirm
            ? 'text-red-600 hover:text-red-700'
            : 'text-gray-600 hover:text-red-600'
        }`}
        aria-label={showDeleteConfirm ? `Confirm delete "${todoText}"` : `Delete "${todoText}"`}
      >
        <DeleteIcon />
      </button>
    </div>
  );
});