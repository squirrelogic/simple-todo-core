import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoApp } from '@/components/todos/TodoApp';
import { TodoErrorBoundary } from '../TodoErrorBoundary';

// Component that can throw an error on demand
const ErrorTrigger = () => {
  const [shouldError, setShouldError] = React.useState(false);
  
  if (shouldError) {
    throw new Error('Simulated todo error');
  }
  
  return (
    <button onClick={() => setShouldError(true)}>
      Trigger Error
    </button>
  );
};

describe('Error Boundary Integration', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('should render TodoApp normally without errors', () => {
    render(
      <TodoErrorBoundary>
        <TodoApp />
      </TodoErrorBoundary>
    );

    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('should catch errors in todo components and show error UI', async () => {
    const user = userEvent.setup();

    render(
      <TodoErrorBoundary>
        <div>
          <TodoApp />
          <ErrorTrigger />
        </div>
      </TodoErrorBoundary>
    );

    // App should render normally initially
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();

    // Trigger an error
    await user.click(screen.getByText('Trigger Error'));

    // Should show todo error boundary UI
    expect(screen.getByText('Todo List Error')).toBeInTheDocument();
    expect(screen.getByText('An error occurred while managing your todos.')).toBeInTheDocument();
    expect(screen.getByText('Reload Todos')).toBeInTheDocument();
  });

  it('should allow recovery from errors', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const [showError, setShowError] = React.useState(false);
      
      return (
        <>
          <button onClick={() => setShowError(!showError)}>
            Toggle Error Component
          </button>
          <TodoErrorBoundary>
            {showError ? <ErrorTrigger /> : <TodoApp />}
          </TodoErrorBoundary>
        </>
      );
    };

    render(<TestComponent />);

    // Initially should show TodoApp
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();

    // Toggle to show error component
    await user.click(screen.getByText('Toggle Error Component'));
    
    // Trigger the error
    await user.click(screen.getByText('Trigger Error'));

    // Should show error UI
    expect(screen.getByText('Todo List Error')).toBeInTheDocument();

    // Toggle back to hide error component
    await user.click(screen.getByText('Toggle Error Component'));

    // Click reload to reset the error boundary
    await user.click(screen.getByText('Reload Todos'));

    // Should show TodoApp again
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
  });
});