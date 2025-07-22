import { KeyboardEvent, useCallback } from 'react';
import { useTodoStore } from '@/stores/todos/todo-store';
import { useConfirmation } from '@/hooks/useConfirmation';

interface UseKeyboardNavigationProps {
  todoId: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onDelete: () => void;
}

export function useKeyboardNavigation({
  todoId,
  isEditing,
  onStartEdit,
  onDelete,
}: UseKeyboardNavigationProps) {
  const toggleTodo = useTodoStore((state) => state.toggleTodo);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!isEditing) {
        switch (e.key) {
          case ' ':
            e.preventDefault();
            toggleTodo(todoId);
            break;
          case 'Delete':
            e.preventDefault();
            onDelete();
            break;
          case 'Enter':
            e.preventDefault();
            onStartEdit();
            break;
        }
      }
    },
    [isEditing, todoId, toggleTodo, onDelete, onStartEdit]
  );

  return { handleKeyDown };
}