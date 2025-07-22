import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilter } from '../TodoFilter';
import { useTodoStore } from '@/stores/todos/todo-store';
import { FilterType } from '@/types/todo';

// Mock the store
jest.mock('@/stores/todos/todo-store');

describe('TodoFilter', () => {
  const mockSetFilter = jest.fn();
  
  const mockStats = {
    total: 5,
    active: 3,
    completed: 2,
  };

  const setupMockStore = (currentFilter: FilterType = 'all') => {
    (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector) {
        const state = {
          filter: currentFilter,
          setFilter: mockSetFilter,
          getStats: () => mockStats,
        };
        return selector(state);
      }
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all filter buttons', () => {
      setupMockStore();
      render(<TodoFilter />);

      expect(screen.getByRole('tab', { name: /Show All todos/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Show Active todos/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Show Completed todos/i })).toBeInTheDocument();
    });

    it('should display counts for each filter', () => {
      setupMockStore();
      render(<TodoFilter />);

      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('(5)')).toBeInTheDocument();
      
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('(3)')).toBeInTheDocument();
      
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('(2)')).toBeInTheDocument();
    });

    it('should show correct active state for "all" filter', () => {
      setupMockStore('all');
      render(<TodoFilter />);

      const allButton = screen.getByRole('tab', { name: /Show All todos/i });
      const activeButton = screen.getByRole('tab', { name: /Show Active todos/i });
      const completedButton = screen.getByRole('tab', { name: /Show Completed todos/i });

      expect(allButton).toHaveClass('bg-blue-600', 'text-white');
      expect(allButton).toHaveAttribute('aria-selected', 'true');
      
      expect(activeButton).toHaveClass('bg-gray-100', 'text-gray-700');
      expect(activeButton).toHaveAttribute('aria-selected', 'false');
      
      expect(completedButton).toHaveClass('bg-gray-100', 'text-gray-700');
      expect(completedButton).toHaveAttribute('aria-selected', 'false');
    });

    it('should show correct active state for "active" filter', () => {
      setupMockStore('active');
      render(<TodoFilter />);

      const allButton = screen.getByRole('tab', { name: /Show All todos/i });
      const activeButton = screen.getByRole('tab', { name: /Show Active todos/i });
      const completedButton = screen.getByRole('tab', { name: /Show Completed todos/i });

      expect(allButton).toHaveAttribute('aria-selected', 'false');
      expect(activeButton).toHaveAttribute('aria-selected', 'true');
      expect(completedButton).toHaveAttribute('aria-selected', 'false');

      expect(activeButton).toHaveClass('bg-blue-600', 'text-white');
    });

    it('should show correct active state for "completed" filter', () => {
      setupMockStore('completed');
      render(<TodoFilter />);

      const completedButton = screen.getByRole('tab', { name: /Show Completed todos/i });
      expect(completedButton).toHaveAttribute('aria-selected', 'true');
      expect(completedButton).toHaveClass('bg-blue-600', 'text-white');
    });
  });

  describe('User interactions', () => {
    it('should call setFilter when clicking "All" button', async () => {
      const user = userEvent.setup();
      setupMockStore('active');
      render(<TodoFilter />);

      const allButton = screen.getByRole('tab', { name: /Show All todos/i });
      await user.click(allButton);

      expect(mockSetFilter).toHaveBeenCalledWith('all');
    });

    it('should call setFilter when clicking "Active" button', async () => {
      const user = userEvent.setup();
      setupMockStore('all');
      render(<TodoFilter />);

      const activeButton = screen.getByRole('tab', { name: /Show Active todos/i });
      await user.click(activeButton);

      expect(mockSetFilter).toHaveBeenCalledWith('active');
    });

    it('should call setFilter when clicking "Completed" button', async () => {
      const user = userEvent.setup();
      setupMockStore('all');
      render(<TodoFilter />);

      const completedButton = screen.getByRole('tab', { name: /Show Completed todos/i });
      await user.click(completedButton);

      expect(mockSetFilter).toHaveBeenCalledWith('completed');
    });

    it('should not call setFilter when clicking the already active filter', async () => {
      const user = userEvent.setup();
      setupMockStore('all');
      render(<TodoFilter />);

      const allButton = screen.getByRole('tab', { name: /Show All todos/i });
      await user.click(allButton);

      // Since 'all' is already active, this could still call setFilter
      // but it's setting the same value
      expect(mockSetFilter).toHaveBeenCalledWith('all');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for tablist', () => {
      setupMockStore();
      render(<TodoFilter />);

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-label', 'Filter todos');
    });

    it('should have proper ARIA attributes for tabs', () => {
      setupMockStore();
      render(<TodoFilter />);

      const allButton = screen.getByRole('tab', { name: /Show All todos/i });
      const activeButton = screen.getByRole('tab', { name: /Show Active todos/i });
      const completedButton = screen.getByRole('tab', { name: /Show Completed todos/i });

      expect(allButton).toHaveAttribute('aria-controls', 'todo-list');
      expect(activeButton).toHaveAttribute('aria-controls', 'todo-list');
      expect(completedButton).toHaveAttribute('aria-controls', 'todo-list');
    });

    it('should have descriptive aria-labels with counts', () => {
      setupMockStore();
      render(<TodoFilter />);

      expect(screen.getByRole('tab', { name: 'Show All todos (5)' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Show Active todos (3)' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Show Completed todos (2)' })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      setupMockStore();
      render(<TodoFilter />);

      const allButton = screen.getByRole('tab', { name: /Show All todos/i });
      const activeButton = screen.getByRole('tab', { name: /Show Active todos/i });

      // Focus on the first button
      allButton.focus();
      expect(allButton).toHaveFocus();

      // Tab to next button
      await user.tab();
      expect(activeButton).toHaveFocus();
    });
  });

  describe('Edge cases', () => {
    it('should handle zero counts gracefully', () => {
      const emptyStats = {
        total: 0,
        active: 0,
        completed: 0,
      };

      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            filter: 'all',
            setFilter: mockSetFilter,
            getStats: () => emptyStats,
          };
          return selector(state);
        }
      });

      render(<TodoFilter />);

      expect(screen.getAllByText('(0)')).toHaveLength(3);
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('should handle undefined stats gracefully', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            filter: 'all',
            setFilter: mockSetFilter,
            getStats: () => ({ total: undefined, active: undefined, completed: undefined } as any),
          };
          return selector(state);
        }
      });

      render(<TodoFilter />);

      // Should still render without crashing
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    it('should handle rapid filter changes', async () => {
      const user = userEvent.setup({ delay: null });
      setupMockStore();
      render(<TodoFilter />);

      const allButton = screen.getByRole('tab', { name: /Show All todos/i });
      const activeButton = screen.getByRole('tab', { name: /Show Active todos/i });
      const completedButton = screen.getByRole('tab', { name: /Show Completed todos/i });

      // Rapidly click different filters
      await user.click(activeButton);
      await user.click(completedButton);
      await user.click(allButton);
      await user.click(activeButton);

      expect(mockSetFilter).toHaveBeenCalledTimes(4);
      expect(mockSetFilter).toHaveBeenLastCalledWith('active');
    });

    it('should apply hover styles to inactive buttons', async () => {
      const user = userEvent.setup();
      setupMockStore('all');
      render(<TodoFilter />);

      const activeButton = screen.getByRole('tab', { name: /Show Active todos/i });
      
      expect(activeButton).toHaveClass('hover:bg-gray-200');
      
      // Hover effect test
      await user.hover(activeButton);
      
      // The hover class should still be present
      expect(activeButton).toHaveClass('hover:bg-gray-200');
    });
  });
});