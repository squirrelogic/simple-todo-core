import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '../TodoItem';
import { TodoItem as TodoItemType } from '@/types/todo';
import { useTodoStore } from '@/stores/todos/todo-store';

// Mock the store
jest.mock('@/stores/todos/todo-store');

describe('TodoItem', () => {
  const mockToggleTodo = jest.fn();
  const mockUpdateTodo = jest.fn();
  const mockDeleteTodo = jest.fn();
  
  const mockTodo: TodoItemType = {
    id: 'test-123',
    text: 'Test todo item',
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Default to successful response
    mockUpdateTodo.mockResolvedValue({ success: true });
    
    (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        toggleTodo: mockToggleTodo,
        updateTodo: mockUpdateTodo,
        deleteTodo: mockDeleteTodo,
      };
      
      if (typeof selector === 'function') {
        return selector(state);
      }
      
      return state;
    });
  });

  it('should render todo item with text', () => {
    render(<TodoItem todo={mockTodo} />);
    
    expect(screen.getByText('Test todo item')).toBeInTheDocument();
  });

  it('should render checkbox with correct state', () => {
    render(<TodoItem todo={mockTodo} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('aria-label', 'Mark "Test todo item" as complete');
  });

  it('should render checked checkbox for completed todo', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute('aria-label', 'Mark "Test todo item" as incomplete');
  });

  it('should apply line-through style for completed todo', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem todo={completedTodo} />);
    
    const text = screen.getByText('Test todo item');
    expect(text).toHaveClass('line-through', 'text-gray-500');
  });

  it('should toggle todo on checkbox click', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} />);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(mockToggleTodo).toHaveBeenCalledWith('test-123');
  });

  it('should enter edit mode on double click', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} />);
    
    const text = screen.getByText('Test todo item');
    await user.dblClick(text);
    
    const input = screen.getByDisplayValue('Test todo item');
    expect(input).toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('should enter edit mode on edit button click', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} />);
    
    const editButton = screen.getByLabelText('Edit "Test todo item"');
    await user.click(editButton);
    
    const input = screen.getByDisplayValue('Test todo item');
    expect(input).toBeInTheDocument();
  });

  it('should save edited text on Enter key', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} />);
    
    const text = screen.getByText('Test todo item');
    await user.dblClick(text);
    
    const input = screen.getByDisplayValue('Test todo item');
    await user.clear(input);
    await user.type(input, 'Updated todo{enter}');
    
    expect(mockUpdateTodo).toHaveBeenCalledWith('test-123', 'Updated todo');
  });

  it('should save edited text on blur', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} />);
    
    const text = screen.getByText('Test todo item');
    await user.dblClick(text);
    
    const input = screen.getByDisplayValue('Test todo item');
    await user.clear(input);
    await user.type(input, 'Updated todo');
    
    // Blur the input
    fireEvent.blur(input);
    
    expect(mockUpdateTodo).toHaveBeenCalledWith('test-123', 'Updated todo');
  });

  it('should cancel edit on Escape key', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} />);
    
    const text = screen.getByText('Test todo item');
    await user.dblClick(text);
    
    const input = screen.getByDisplayValue('Test todo item');
    await user.clear(input);
    await user.type(input, 'Changed text{escape}');
    
    expect(mockUpdateTodo).not.toHaveBeenCalled();
    expect(screen.getByText('Test todo item')).toBeInTheDocument();
  });

  it('should not save if edited text is empty', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} />);
    
    const text = screen.getByText('Test todo item');
    await user.dblClick(text);
    
    const input = screen.getByDisplayValue('Test todo item');
    await user.clear(input);
    await user.type(input, '{enter}');
    
    expect(mockUpdateTodo).not.toHaveBeenCalled();
  });

  it('should not save if text is unchanged', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} />);
    
    const text = screen.getByText('Test todo item');
    await user.dblClick(text);
    
    const input = screen.getByDisplayValue('Test todo item');
    await user.type(input, '{enter}');
    
    expect(mockUpdateTodo).not.toHaveBeenCalled();
  });

  it('should show delete confirmation on first click', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} />);
    
    const deleteButton = screen.getByLabelText('Delete "Test todo item"');
    await user.click(deleteButton);
    
    expect(screen.getByLabelText('Confirm delete "Test todo item"')).toBeInTheDocument();
    expect(mockDeleteTodo).not.toHaveBeenCalled();
  });

  it('should delete todo on confirmation', async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} />);
    
    const deleteButton = screen.getByLabelText('Delete "Test todo item"');
    await user.click(deleteButton);
    
    const confirmButton = screen.getByLabelText('Confirm delete "Test todo item"');
    await user.click(confirmButton);
    
    expect(mockDeleteTodo).toHaveBeenCalledWith('test-123');
  });

  it('should cancel delete confirmation after timeout', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ delay: null });
    
    render(<TodoItem todo={mockTodo} />);
    
    const deleteButton = screen.getByLabelText('Delete "Test todo item"');
    await user.click(deleteButton);
    
    expect(screen.getByLabelText('Confirm delete "Test todo item"')).toBeInTheDocument();
    
    // Fast-forward 3 seconds
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      expect(screen.getByLabelText('Delete "Test todo item"')).toBeInTheDocument();
    });
    
    jest.useRealTimers();
  });

  it('should display error when update fails', async () => {
    const user = userEvent.setup();
    mockUpdateTodo.mockResolvedValueOnce({ 
      success: false, 
      error: 'Update failed' 
    });
    
    render(<TodoItem todo={mockTodo} />);
    
    // Enter edit mode
    const editButton = screen.getByLabelText('Edit "Test todo item"');
    await user.click(editButton);
    
    // Change text and submit
    const input = screen.getByLabelText('Edit todo text');
    await user.clear(input);
    await user.type(input, 'Updated text');
    await user.type(input, '{enter}');
    
    // Should show error
    expect(await screen.findByText('Update failed')).toBeInTheDocument();
    expect(input).toHaveValue('Updated text'); // Input should remain in edit mode
  });

  describe('Keyboard navigation', () => {
    it('should toggle on Space key', async () => {
      render(<TodoItem todo={mockTodo} />);
      
      const todoItem = screen.getByRole('listitem');
      todoItem.focus();
      
      fireEvent.keyDown(todoItem, { key: ' ' });
      
      expect(mockToggleTodo).toHaveBeenCalledWith('test-123');
    });

    it('should delete on Delete key', async () => {
      render(<TodoItem todo={mockTodo} />);
      
      const todoItem = screen.getByRole('listitem');
      todoItem.focus();
      
      fireEvent.keyDown(todoItem, { key: 'Delete' });
      
      // First press shows confirmation
      expect(screen.getByLabelText('Confirm delete "Test todo item"')).toBeInTheDocument();
      
      fireEvent.keyDown(todoItem, { key: 'Delete' });
      
      // Second press confirms
      expect(mockDeleteTodo).toHaveBeenCalledWith('test-123');
    });

    it('should enter edit mode on Enter key', () => {
      render(<TodoItem todo={mockTodo} />);
      
      const todoItem = screen.getByRole('listitem');
      todoItem.focus();
      
      fireEvent.keyDown(todoItem, { key: 'Enter' });
      
      const input = screen.getByDisplayValue('Test todo item');
      expect(input).toBeInTheDocument();
    });

    it('should not respond to keys when editing', async () => {
      const user = userEvent.setup();
      render(<TodoItem todo={mockTodo} />);
      
      const text = screen.getByText('Test todo item');
      await user.dblClick(text);
      
      const todoItem = screen.getByRole('listitem');
      fireEvent.keyDown(todoItem, { key: ' ' });
      fireEvent.keyDown(todoItem, { key: 'Delete' });
      
      expect(mockToggleTodo).not.toHaveBeenCalled();
      expect(mockDeleteTodo).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<TodoItem todo={mockTodo} />);
      
      const todoItem = screen.getByRole('listitem');
      expect(todoItem).toHaveAttribute('tabIndex', '0');
      expect(todoItem).toHaveAttribute('aria-label', 'Todo: Test todo item, active');
    });

    it('should have proper ARIA attributes for completed todo', () => {
      const completedTodo = { ...mockTodo, completed: true };
      render(<TodoItem todo={completedTodo} />);
      
      const todoItem = screen.getByRole('listitem');
      expect(todoItem).toHaveAttribute('aria-label', 'Todo: Test todo item, completed');
    });

    it('should have edit input with aria-label', async () => {
      const user = userEvent.setup();
      render(<TodoItem todo={mockTodo} />);
      
      const text = screen.getByText('Test todo item');
      await user.dblClick(text);
      
      const input = screen.getByLabelText('Edit todo text');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Hover effects', () => {
    it('should show action buttons on hover', async () => {
      const user = userEvent.setup();
      render(<TodoItem todo={mockTodo} />);
      
      const todoItem = screen.getByRole('listitem');
      
      // Buttons should be invisible initially (opacity-0)
      const editButton = screen.getByLabelText('Edit "Test todo item"');
      
      expect(editButton.parentElement).toHaveClass('opacity-0');
      
      // Hover to show buttons
      await user.hover(todoItem);
      
      expect(editButton.parentElement).toHaveClass('group-hover:opacity-100');
    });
  });
});