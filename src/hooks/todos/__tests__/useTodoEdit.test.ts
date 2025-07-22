import { renderHook, act } from '@testing-library/react';
import { useTodoEdit } from '../useTodoEdit';
import { useTodoStore } from '@/stores/todos/todo-store';

// Mock the store
jest.mock('@/stores/todos/todo-store');

describe('useTodoEdit', () => {
  const mockUpdateTodo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdateTodo.mockResolvedValue({ success: true });
    
    (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        updateTodo: mockUpdateTodo,
      };
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useTodoEdit('test-id', 'Initial text'));

    expect(result.current.isEditing).toBe(false);
    expect(result.current.editText).toBe('Initial text');
    expect(result.current.editError).toBe(null);
    expect(result.current.isSaving).toBe(false);
  });

  it('should start editing', () => {
    const { result } = renderHook(() => useTodoEdit('test-id', 'Initial text'));

    act(() => {
      result.current.startEdit();
    });

    expect(result.current.isEditing).toBe(true);
    expect(result.current.editText).toBe('Initial text');
    expect(result.current.editError).toBe(null);
  });

  it('should handle text change', () => {
    const { result } = renderHook(() => useTodoEdit('test-id', 'Initial text'));

    act(() => {
      result.current.startEdit();
      result.current.handleEditTextChange('Updated text');
    });

    expect(result.current.editText).toBe('Updated text');
    expect(result.current.editError).toBe(null);
  });

  it('should save edit successfully', async () => {
    const { result } = renderHook(() => useTodoEdit('test-id', 'Initial text'));

    act(() => {
      result.current.startEdit();
      result.current.handleEditTextChange('Updated text');
    });

    await act(async () => {
      await result.current.saveEdit();
    });

    expect(mockUpdateTodo).toHaveBeenCalledWith('test-id', 'Updated text');
    expect(result.current.isEditing).toBe(false);
    expect(result.current.isSaving).toBe(false);
  });

  it('should handle save error', async () => {
    mockUpdateTodo.mockResolvedValueOnce({ 
      success: false, 
      error: 'Update failed' 
    });

    const { result } = renderHook(() => useTodoEdit('test-id', 'Initial text'));

    act(() => {
      result.current.startEdit();
      result.current.handleEditTextChange('Updated text');
    });

    await act(async () => {
      await result.current.saveEdit();
    });

    expect(result.current.isEditing).toBe(true);
    expect(result.current.editError).toBe('Update failed');
    expect(result.current.isSaving).toBe(false);
  });

  it('should cancel edit', () => {
    const { result } = renderHook(() => useTodoEdit('test-id', 'Initial text'));

    act(() => {
      result.current.startEdit();
      result.current.handleEditTextChange('Updated text');
    });

    act(() => {
      result.current.cancelEdit();
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.editText).toBe('Initial text');
    expect(result.current.editError).toBe(null);
  });

  it('should not save if text is unchanged', async () => {
    const { result } = renderHook(() => useTodoEdit('test-id', 'Initial text'));

    act(() => {
      result.current.startEdit();
    });

    await act(async () => {
      await result.current.saveEdit();
    });

    expect(mockUpdateTodo).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
  });

  it('should trim text before saving', async () => {
    const { result } = renderHook(() => useTodoEdit('test-id', 'Initial text'));

    act(() => {
      result.current.startEdit();
      result.current.handleEditTextChange('  Updated text  ');
    });

    await act(async () => {
      await result.current.saveEdit();
    });

    expect(mockUpdateTodo).toHaveBeenCalledWith('test-id', 'Updated text');
  });
});