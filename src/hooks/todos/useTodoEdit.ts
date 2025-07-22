import { useState, useCallback } from 'react';
import { useTodoStore } from '@/stores/todos/todo-store';

export function useTodoEdit(todoId: string, initialText: string) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(initialText);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const startEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(initialText);
    setEditError(null);
  }, [initialText]);

  const saveEdit = useCallback(async () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== initialText) {
      setIsSaving(true);
      setEditError(null);
      
      const result = await updateTodo(todoId, trimmedText);
      
      if (result.success) {
        setIsEditing(false);
      } else {
        setEditError(result.error || 'Failed to update todo');
      }
      
      setIsSaving(false);
    } else {
      setIsEditing(false);
    }
  }, [editText, initialText, todoId, updateTodo]);

  const cancelEdit = useCallback(() => {
    setEditText(initialText);
    setIsEditing(false);
    setEditError(null);
  }, [initialText]);

  const handleEditTextChange = useCallback((text: string) => {
    setEditText(text);
    setEditError(null);
  }, []);

  return {
    isEditing,
    editText,
    editError,
    isSaving,
    startEdit,
    saveEdit,
    cancelEdit,
    handleEditTextChange,
  };
}