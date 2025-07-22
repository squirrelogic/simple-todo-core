'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { TodoItem as TodoItemType } from '@/types/todo';
import { TodoCheckbox } from './TodoCheckbox';
import { TodoText } from './TodoText';
import { TodoActions } from './TodoActions';

interface TodoContextValue {
  todo: TodoItemType;
  isEditing: boolean;
  editText: string;
  editError?: string | null;
  isSaving?: boolean;
  showDeleteConfirm: boolean;
  onToggle: () => void;
  onStartEdit: () => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTextChange: (text: string) => void;
  onDelete: () => void;
}

const TodoContext = createContext<TodoContextValue | undefined>(undefined);

function useTodoContext() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('Todo components must be used within Todo.Container');
  }
  return context;
}

interface ContainerProps {
  children: ReactNode;
  todo: TodoItemType;
  value: Omit<TodoContextValue, 'todo'>;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
}

function Container({ children, todo, value, onFocus, onKeyDown }: ContainerProps) {
  return (
    <TodoContext.Provider value={{ todo, ...value }}>
      <div
        className="group flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        role="listitem"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        aria-label={`Todo: ${todo.text}, ${todo.completed ? 'completed' : 'active'}`}
      >
        {children}
      </div>
    </TodoContext.Provider>
  );
}

function Checkbox() {
  const { todo, onToggle } = useTodoContext();
  
  return (
    <TodoCheckbox
      checked={todo.completed}
      onChange={onToggle}
      label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
    />
  );
}

function Text() {
  const {
    todo,
    isEditing,
    editText,
    editError,
    isSaving,
    onEditTextChange,
    onSaveEdit,
    onCancelEdit,
    onStartEdit,
  } = useTodoContext();
  
  return (
    <TodoText
      text={todo.text}
      completed={todo.completed}
      isEditing={isEditing}
      editText={editText}
      editError={editError}
      isSaving={isSaving}
      onEditTextChange={onEditTextChange}
      onSave={onSaveEdit}
      onCancel={onCancelEdit}
      onStartEdit={onStartEdit}
      todoId={todo.id}
    />
  );
}

function Actions() {
  const { todo, isEditing, showDeleteConfirm, onStartEdit, onDelete } = useTodoContext();
  
  return (
    <TodoActions
      isEditing={isEditing}
      showDeleteConfirm={showDeleteConfirm}
      onEdit={onStartEdit}
      onDelete={onDelete}
      todoText={todo.text}
    />
  );
}

export const Todo = {
  Container,
  Checkbox,
  Text,
  Actions,
};