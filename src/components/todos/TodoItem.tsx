'use client';

import { memo } from 'react';
import { TodoItem as TodoItemType } from '@/types/todo';
import { useTodoStore } from '@/stores/todos/todo-store';
import { useConfirmation } from '@/hooks/useConfirmation';
import { useTodoEdit } from '@/hooks/todos/useTodoEdit';
import { useKeyboardNavigation } from '@/hooks/todos/useKeyboardNavigation';
import { TodoCheckbox } from './TodoCheckbox';
import { TodoText } from './TodoText';
import { TodoActions } from './TodoActions';

interface TodoItemProps {
  todo: TodoItemType;
  onFocus?: (todoId: string) => void;
}

function TodoItemComponent({ todo, onFocus }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodoStore();
  
  const {
    isEditing,
    editText,
    editError,
    isSaving,
    startEdit,
    saveEdit,
    cancelEdit,
    handleEditTextChange,
  } = useTodoEdit(todo.id, todo.text);
  
  const {
    showConfirmation: showDeleteConfirm,
    requestConfirmation: requestDeleteConfirmation,
    confirm: confirmDelete,
  } = useConfirmation({
    onConfirm: () => deleteTodo(todo.id),
  });

  const handleDelete = () => {
    if (showDeleteConfirm) {
      confirmDelete();
    } else {
      requestDeleteConfirmation();
    }
  };

  const { handleKeyDown } = useKeyboardNavigation({
    todoId: todo.id,
    isEditing,
    onStartEdit: startEdit,
    onDelete: handleDelete,
  });

  return (
    <div
      className="group flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      role="listitem"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onFocus={() => onFocus?.(todo.id)}
      aria-label={`Todo: ${todo.text}, ${todo.completed ? 'completed' : 'active'}`}
    >
      <TodoCheckbox
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      
      <TodoText
        text={todo.text}
        completed={todo.completed}
        isEditing={isEditing}
        editText={editText}
        editError={editError}
        isSaving={isSaving}
        onEditTextChange={handleEditTextChange}
        onSave={saveEdit}
        onCancel={cancelEdit}
        onStartEdit={startEdit}
        todoId={todo.id}
      />
      
      <TodoActions
        isEditing={isEditing}
        showDeleteConfirm={showDeleteConfirm}
        onEdit={startEdit}
        onDelete={handleDelete}
        todoText={todo.text}
      />
    </div>
  );
}

export const TodoItem = memo(TodoItemComponent);