import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoErrorBoundary } from '../TodoErrorBoundary';
import { useTodoStore } from '@/stores/todos/todo-store';

// Mock the store
jest.mock('@/stores/todos/todo-store');

// Component that throws an error
const ThrowError = ({ error }: { error: Error }) => {
  throw error;
};

describe('TodoErrorBoundary', () => {
  const mockLoadTodos = jest.fn();

  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useTodoStore as unknown as jest.Mock).mockImplementation((selector) => {
      if (typeof selector === 'function') {
        return selector({ loadTodos: mockLoadTodos });
      }
      return { loadTodos: mockLoadTodos };
    });
  });

  it('should render children when there is no error', () => {
    render(
      <TodoErrorBoundary>
        <div>Todo content</div>
      </TodoErrorBoundary>
    );

    expect(screen.getByText('Todo content')).toBeInTheDocument();
  });

  it('should show storage error message for storage errors', () => {
    render(
      <TodoErrorBoundary>
        <ThrowError error={new Error('localStorage quota exceeded')} />
      </TodoErrorBoundary>
    );

    expect(screen.getByText('Todo List Error')).toBeInTheDocument();
    expect(
      screen.getByText('Unable to save or load your todos. Please check your browser storage settings.')
    ).toBeInTheDocument();
    expect(screen.getByText('Clear Storage & Retry')).toBeInTheDocument();
  });

  it('should show network error message for network errors', () => {
    render(
      <TodoErrorBoundary>
        <ThrowError error={new Error('Network request failed')} />
      </TodoErrorBoundary>
    );

    expect(screen.getByText('Todo List Error')).toBeInTheDocument();
    expect(
      screen.getByText('Network error. Please check your connection and try again.')
    ).toBeInTheDocument();
  });

  it('should show generic error message for other errors', () => {
    render(
      <TodoErrorBoundary>
        <ThrowError error={new Error('Unknown error')} />
      </TodoErrorBoundary>
    );

    expect(screen.getByText('Todo List Error')).toBeInTheDocument();
    expect(
      screen.getByText('An error occurred while managing your todos.')
    ).toBeInTheDocument();
  });

  it('should reload todos when reload button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TodoErrorBoundary>
        <ThrowError error={new Error('Test error')} />
      </TodoErrorBoundary>
    );

    await user.click(screen.getByText('Reload Todos'));

    expect(mockLoadTodos).toHaveBeenCalled();
  });

  it('should clear storage and reset on clear storage button click', async () => {
    const user = userEvent.setup();
    const mockClear = jest.fn();
    Storage.prototype.clear = mockClear;

    render(
      <TodoErrorBoundary>
        <ThrowError error={new Error('Storage quota exceeded')} />
      </TodoErrorBoundary>
    );

    await user.click(screen.getByText('Clear Storage & Retry'));

    expect(mockClear).toHaveBeenCalled();
  });

  it('should show technical details when expanded', async () => {
    const user = userEvent.setup();
    const error = new Error('Test error with stack');
    error.stack = 'Error: Test error with stack\n    at TestComponent';

    render(
      <TodoErrorBoundary>
        <ThrowError error={error} />
      </TodoErrorBoundary>
    );

    // Technical details should be hidden initially - check that details element is not open
    const detailsElement = screen.getByText('Technical details').closest('details');
    expect(detailsElement).not.toHaveAttribute('open');

    // Click to expand technical details
    await user.click(screen.getByText('Technical details'));

    // Should show the error stack
    expect(screen.getByText(/at TestComponent/)).toBeInTheDocument();
  });
});