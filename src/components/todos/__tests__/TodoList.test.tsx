import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TodoList } from '../TodoList';
import { useTodoStore } from '@/stores/todos/todo-store';
import { TodoItem } from '@/types/todo';

// Mock the store
jest.mock('@/stores/todos/todo-store');

// Mock the TodoItem component
jest.mock('../TodoItem', () => ({
  TodoItem: ({ todo }: { todo: TodoItem }) => (
    <div data-testid={`todo-${todo.id}`}>{todo.text}</div>
  ),
}));

describe('TodoList', () => {
  const mockLoadTodos = jest.fn();
  
  const mockTodos: TodoItem[] = [
    {
      id: '1',
      text: 'First todo',
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: '2',
      text: 'Second todo',
      completed: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      id: '3',
      text: 'Third todo',
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading state', () => {
    it('should display loading spinner when isLoading is true', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => [],
            filter: 'all',
            isLoading: true,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      const spinner = screen.getByText((content, element) => {
        return element?.className?.includes('animate-spin') || false;
      });
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('should call loadTodos on mount', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => [],
            filter: 'all',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      expect(mockLoadTodos).toHaveBeenCalledTimes(1);
    });
  });

  describe('Empty states', () => {
    it('should display appropriate message when no todos exist (filter: all)', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => [],
            filter: 'all',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    });

    it('should display appropriate message when no active todos (filter: active)', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => [],
            filter: 'active',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      expect(screen.getByText('No active todos. Great job!')).toBeInTheDocument();
    });

    it('should display appropriate message when no completed todos (filter: completed)', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => [],
            filter: 'completed',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      expect(screen.getByText('No completed todos yet.')).toBeInTheDocument();
    });
  });

  describe('Rendering todos', () => {
    it('should render all todos when filter is "all"', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => mockTodos,
            filter: 'all',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      expect(screen.getByTestId('todo-1')).toBeInTheDocument();
      expect(screen.getByTestId('todo-2')).toBeInTheDocument();
      expect(screen.getByTestId('todo-3')).toBeInTheDocument();
    });

    it('should render only active todos when filter is "active"', () => {
      const activeTodos = mockTodos.filter(todo => !todo.completed);
      
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => activeTodos,
            filter: 'active',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      expect(screen.getByTestId('todo-1')).toBeInTheDocument();
      expect(screen.queryByTestId('todo-2')).not.toBeInTheDocument();
      expect(screen.getByTestId('todo-3')).toBeInTheDocument();
    });

    it('should render only completed todos when filter is "completed"', () => {
      const completedTodos = mockTodos.filter(todo => todo.completed);
      
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => completedTodos,
            filter: 'completed',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      expect(screen.queryByTestId('todo-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('todo-2')).toBeInTheDocument();
      expect(screen.queryByTestId('todo-3')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes for the list', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => mockTodos,
            filter: 'all',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', 'all todos list');
      expect(list).toHaveAttribute('aria-live', 'polite');
    });

    it('should update aria-label based on filter', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => mockTodos,
            filter: 'active',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', 'active todos list');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty todo array gracefully', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => [],
            filter: 'all',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      render(<TodoList />);

      expect(screen.queryByRole('list')).not.toBeInTheDocument();
      expect(screen.getByText('No todos yet. Add one above!')).toBeInTheDocument();
    });

    it('should not crash when store returns undefined', () => {
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => undefined as unknown as TodoItem[],
            filter: 'all',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      // This should not throw
      expect(() => render(<TodoList />)).not.toThrow();
    });

    it('should re-render when todos change', async () => {
      let currentTodos = [mockTodos[0]];
      
      (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
        if (selector) {
          const state = {
            getFilteredTodos: () => currentTodos,
            filter: 'all',
            isLoading: false,
            loadTodos: mockLoadTodos,
          };
          return selector(state);
        }
      });

      const { rerender } = render(<TodoList />);
      
      expect(screen.getByTestId('todo-1')).toBeInTheDocument();
      expect(screen.queryByTestId('todo-2')).not.toBeInTheDocument();

      // Update todos
      currentTodos = [mockTodos[0], mockTodos[1]];
      rerender(<TodoList />);

      await waitFor(() => {
        expect(screen.getByTestId('todo-1')).toBeInTheDocument();
        expect(screen.getByTestId('todo-2')).toBeInTheDocument();
      });
    });
  });
});