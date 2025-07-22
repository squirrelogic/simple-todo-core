import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '../TodoInput';
import { useTodoStore } from '@/stores/todos/todo-store';

// Mock the store
jest.mock('@/stores/todos/todo-store');

describe('TodoInput', () => {
  const mockAddTodo = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Default to successful response
    mockAddTodo.mockResolvedValue({ success: true });
    
    (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        const state = {
          addTodo: mockAddTodo,
          error: null,
        };
        return selector(state);
      }
      return {
        addTodo: mockAddTodo,
        error: null,
      };
    });
  });

  it('should render input with placeholder', () => {
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('maxLength', '255');
  });

  it('should handle text input', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Buy groceries');
    
    expect(input).toHaveValue('Buy groceries');
  });

  it('should submit todo on form submission', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Buy groceries');
    await user.type(input, '{enter}');
    
    expect(mockAddTodo).toHaveBeenCalledWith('Buy groceries');
    expect(input).toHaveValue('');
  });

  it('should not submit empty todos', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '{enter}');
    
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it('should show error for empty submission', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '   '); // Only spaces
    await user.type(input, '{enter}');
    
    expect(screen.getByText('Please enter a todo')).toBeInTheDocument();
    expect(mockAddTodo).not.toHaveBeenCalled();
  });

  it('should clear input on Escape key', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Buy groceries');
    await user.type(input, '{escape}');
    
    expect(input).toHaveValue('');
  });

  it('should show character count when typing', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Buy groceries');
    
    const charCount = screen.getByLabelText(/characters remaining/);
    expect(charCount).toHaveTextContent('242'); // 255 - 13
  });

  it('should show warning color when near character limit', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const longText = 'a'.repeat(240);
    await user.type(input, longText);
    
    const charCount = screen.getByLabelText(/characters remaining/);
    expect(charCount).toHaveClass('text-orange-500');
  });

  it('should display error when addTodo fails', async () => {
    const user = userEvent.setup();
    mockAddTodo.mockResolvedValueOnce({ 
      success: false, 
      error: 'Todo text cannot exceed 255 characters' 
    });
    
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Test todo');
    await user.type(input, '{enter}');
    
    expect(await screen.findByText('Todo text cannot exceed 255 characters')).toBeInTheDocument();
    expect(input).toHaveValue('Test todo'); // Input should not be cleared on error
  });

  it('should disable input while submitting', async () => {
    const user = userEvent.setup();
    let resolvePromise: (value: { success: boolean; error?: string }) => void;
    const promise = new Promise<{ success: boolean; error?: string }>((resolve) => {
      resolvePromise = resolve;
    });
    mockAddTodo.mockReturnValueOnce(promise);
    
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Test todo');
    
    // Start submission
    const submitPromise = user.type(input, '{enter}');
    
    // Input should be disabled while submitting
    await waitFor(() => {
      expect(input).toBeDisabled();
    });
    
    // Resolve the promise
    await act(async () => {
      resolvePromise!({ success: true });
    });
    
    // Wait for submission to complete
    await submitPromise;
    
    // Input should be enabled again and cleared
    await waitFor(() => {
      expect(input).not.toBeDisabled();
      expect(input).toHaveValue('');
    });
  });

  it('should have proper ARIA attributes', () => {
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    expect(input).toHaveAttribute('aria-label', 'New todo input');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('should set aria-invalid when there is an error', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '   ');
    await user.type(input, '{enter}');
    
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'todo-input-error');
  });

  it('should clear error when typing valid text', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    // First cause an error
    await user.type(input, '   ');
    await user.type(input, '{enter}');
    expect(screen.getByText('Please enter a todo')).toBeInTheDocument();
    
    // Then type valid text
    await user.clear(input);
    await user.type(input, 'Valid todo');
    
    expect(screen.queryByText('Please enter a todo')).not.toBeInTheDocument();
  });

  it('should prevent default form submission', async () => {
    const user = userEvent.setup();
    
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const form = input.closest('form');
    
    const submitHandler = jest.fn((e) => e.preventDefault());
    form?.addEventListener('submit', submitHandler);
    
    await user.type(input, 'Test todo');
    await user.type(input, '{enter}');
    
    expect(mockAddTodo).toHaveBeenCalledWith('Test todo');
    // The form should handle its own submission
    expect(input).toHaveValue('');
  });

  it('should handle rapid submissions', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    
    await user.type(input, 'Todo 1');
    await user.type(input, '{enter}');
    
    await user.type(input, 'Todo 2');
    await user.type(input, '{enter}');
    
    await user.type(input, 'Todo 3');
    await user.type(input, '{enter}');
    
    expect(mockAddTodo).toHaveBeenCalledTimes(3);
    expect(mockAddTodo).toHaveBeenNthCalledWith(1, 'Todo 1');
    expect(mockAddTodo).toHaveBeenNthCalledWith(2, 'Todo 2');
    expect(mockAddTodo).toHaveBeenNthCalledWith(3, 'Todo 3');
  });
});