import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFooter } from '../TodoFooter';
import { useTodoStore } from '@/stores/todos/todo-store';

// Mock the store
jest.mock('@/stores/todos/todo-store');

describe('TodoFooter', () => {
  const mockClearCompleted = jest.fn();
  const mockToggleAll = jest.fn();
  
  const setupMockStore = (stats = { total: 5, active: 3, completed: 2 }) => {
    (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector) {
        const state = {
          getStats: () => stats,
          clearCompleted: mockClearCompleted,
          toggleAll: mockToggleAll,
        };
        return selector(state);
      }
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when there are no todos', () => {
      setupMockStore({ total: 0, active: 0, completed: 0 });
      const { container } = render(<TodoFooter />);

      expect(container.firstChild).toBeNull();
    });

    it('should render items left text with singular form', () => {
      setupMockStore({ total: 3, active: 1, completed: 2 });
      render(<TodoFooter />);

      expect(screen.getByText('1 item left')).toBeInTheDocument();
    });

    it('should render items left text with plural form', () => {
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      expect(screen.getByText('3 items left')).toBeInTheDocument();
    });

    it('should show toggle all button when todos exist', () => {
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      expect(screen.getByText('Mark all complete')).toBeInTheDocument();
    });

    it('should show "Mark all active" when all todos are completed', () => {
      setupMockStore({ total: 3, active: 0, completed: 3 });
      render(<TodoFooter />);

      expect(screen.getByText('Mark all active')).toBeInTheDocument();
    });

    it('should show clear completed button when completed todos exist', () => {
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      expect(screen.getByRole('button', { name: /Clear 2 completed todos/i })).toBeInTheDocument();
    });

    it('should not show clear completed button when no completed todos', () => {
      setupMockStore({ total: 3, active: 3, completed: 0 });
      render(<TodoFooter />);

      expect(screen.queryByRole('button', { name: /Clear completed/i })).not.toBeInTheDocument();
    });

    it('should use singular form in clear completed button', () => {
      setupMockStore({ total: 3, active: 2, completed: 1 });
      render(<TodoFooter />);

      expect(screen.getByRole('button', { name: /Clear 1 completed todo/i })).toBeInTheDocument();
    });
  });

  describe('Toggle all functionality', () => {
    it('should call toggleAll when clicking toggle all button', async () => {
      const user = userEvent.setup();
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const toggleButton = screen.getByText('Mark all complete');
      await user.click(toggleButton);

      expect(mockToggleAll).toHaveBeenCalledTimes(1);
    });

    it('should have proper aria-label for toggle all button', () => {
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const button = screen.getByLabelText('Mark all todos as complete');
      expect(button).toBeInTheDocument();
    });

    it('should have proper aria-label when all todos are completed', () => {
      setupMockStore({ total: 3, active: 0, completed: 3 });
      render(<TodoFooter />);

      const button = screen.getByLabelText('Mark all todos as incomplete');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Clear completed functionality', () => {
    it('should show confirmation on first click', async () => {
      const user = userEvent.setup();
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const clearButton = screen.getByRole('button', { name: /Clear 2 completed todos/i });
      await user.click(clearButton);

      expect(screen.getByText('Confirm clear?')).toBeInTheDocument();
      expect(mockClearCompleted).not.toHaveBeenCalled();
    });

    it('should clear completed on confirmation click', async () => {
      const user = userEvent.setup();
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const clearButton = screen.getByRole('button', { name: /Clear 2 completed todos/i });
      await user.click(clearButton);

      const confirmButton = screen.getByRole('button', { name: /Confirm clear 2 completed todos/i });
      await user.click(confirmButton);

      expect(mockClearCompleted).toHaveBeenCalledTimes(1);
    });

    it('should reset confirmation state after timeout', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const clearButton = screen.getByRole('button', { name: /Clear 2 completed todos/i });
      await user.click(clearButton);

      expect(screen.getByText('Confirm clear?')).toBeInTheDocument();

      // Fast-forward 3 seconds
      await act(async () => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(screen.queryByText('Confirm clear?')).not.toBeInTheDocument();
        expect(screen.getByText('Clear completed')).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should apply red styling when in confirmation state', async () => {
      const user = userEvent.setup();
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const clearButton = screen.getByRole('button', { name: /Clear 2 completed todos/i });
      
      // Initial state
      expect(clearButton).toHaveClass('text-gray-700');
      
      await user.click(clearButton);

      // Confirmation state
      const confirmButton = screen.getByRole('button', { name: /Confirm clear 2 completed todos/i });
      expect(confirmButton).toHaveClass('text-red-600', 'font-medium');
    });
  });

  describe('Accessibility', () => {
    it('should have aria-live on items left text', () => {
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const itemsLeft = screen.getByText('3 items left');
      expect(itemsLeft).toHaveAttribute('aria-live', 'polite');
    });

    it('should update aria-label for clear button based on state', async () => {
      const user = userEvent.setup();
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const clearButton = screen.getByRole('button', { name: 'Clear 2 completed todos' });
      await user.click(clearButton);

      expect(screen.getByRole('button', { name: 'Confirm clear 2 completed todos' })).toBeInTheDocument();
    });

    it('should have proper container styling', () => {
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const footer = screen.getByText('3 items left').closest('div');
      expect(footer).toHaveClass('bg-gray-50', 'rounded-lg');
    });
  });

  describe('Edge cases', () => {
    it('should handle zero active todos', () => {
      setupMockStore({ total: 3, active: 0, completed: 3 });
      render(<TodoFooter />);

      expect(screen.getByText('0 items left')).toBeInTheDocument();
    });

    it('should handle large numbers', () => {
      setupMockStore({ total: 999, active: 567, completed: 432 });
      render(<TodoFooter />);

      expect(screen.getByText('567 items left')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Clear 432 completed todos/i })).toBeInTheDocument();
    });

    it('should handle rapid clear button clicks', async () => {
      const user = userEvent.setup({ delay: null });
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const clearButton = screen.getByRole('button', { name: /Clear 2 completed todos/i });
      
      // First click - shows confirmation
      await user.click(clearButton);
      // Second click - confirms
      await user.click(clearButton);
      // Third click - should not do anything as it's already cleared
      await user.click(clearButton);

      expect(mockClearCompleted).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined stats gracefully', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getStats: () => ({ total: undefined, active: undefined, completed: undefined } as { total: number; active: number; completed: number }),
            clearCompleted: mockClearCompleted,
            toggleAll: mockToggleAll,
          };
          return selector(state);
        }
      });

      // Should not crash
      expect(() => render(<TodoFooter />)).not.toThrow();
    });

    it('should not show toggle all button when total is 0', () => {
      setupMockStore({ total: 0, active: 0, completed: 0 });
      const { container } = render(<TodoFooter />);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should handle multiple confirmation timeouts correctly', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      
      setupMockStore({ total: 5, active: 3, completed: 2 });
      render(<TodoFooter />);

      const clearButton = screen.getByRole('button', { name: /Clear 2 completed todos/i });
      
      // First click
      await user.click(clearButton);
      expect(screen.getByText('Confirm clear?')).toBeInTheDocument();

      // Fast-forward 1 second
      jest.advanceTimersByTime(1000);

      // Click again (should reset the timer)
      await user.click(clearButton);
      expect(mockClearCompleted).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });
});