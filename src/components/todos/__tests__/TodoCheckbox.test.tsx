import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoCheckbox } from '../TodoCheckbox';

describe('TodoCheckbox', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render unchecked checkbox', () => {
    render(
      <TodoCheckbox
        checked={false}
        onChange={mockOnChange}
        label="Test checkbox"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('aria-label', 'Test checkbox');
  });

  it('should render checked checkbox', () => {
    render(
      <TodoCheckbox
        checked={true}
        onChange={mockOnChange}
        label="Test checkbox"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onChange when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TodoCheckbox
        checked={false}
        onChange={mockOnChange}
        label="Test checkbox"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <TodoCheckbox
        checked={false}
        onChange={mockOnChange}
        disabled={true}
        label="Test checkbox"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('should have proper styling classes', () => {
    render(
      <TodoCheckbox
        checked={false}
        onChange={mockOnChange}
        label="Test checkbox"
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('w-5', 'h-5', 'text-blue-600', 'rounded');
  });
});