import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoText } from '../TodoText';

describe('TodoText', () => {
  const defaultProps = {
    text: 'Test todo',
    completed: false,
    isEditing: false,
    editText: 'Test todo',
    editError: null,
    isSaving: false,
    onEditTextChange: jest.fn(),
    onSave: jest.fn(),
    onCancel: jest.fn(),
    onStartEdit: jest.fn(),
    todoId: 'test-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render text in display mode', () => {
    render(<TodoText {...defaultProps} />);

    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  it('should show strikethrough for completed todos', () => {
    render(<TodoText {...defaultProps} completed={true} />);

    const text = screen.getByText('Test todo');
    expect(text).toHaveClass('line-through', 'text-gray-500');
  });

  it('should call onStartEdit on double click', async () => {
    const user = userEvent.setup();
    render(<TodoText {...defaultProps} />);

    const text = screen.getByText('Test todo');
    await user.dblClick(text);

    expect(defaultProps.onStartEdit).toHaveBeenCalled();
  });

  it('should render input in edit mode', () => {
    render(<TodoText {...defaultProps} isEditing={true} />);

    const input = screen.getByLabelText('Edit todo text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Test todo');
  });

  it('should call onEditTextChange when typing', async () => {
    const user = userEvent.setup();
    render(<TodoText {...defaultProps} isEditing={true} />);

    const input = screen.getByLabelText('Edit todo text');
    await user.type(input, ' updated');

    expect(defaultProps.onEditTextChange).toHaveBeenCalled();
  });

  it('should call onSave on Enter key', async () => {
    const user = userEvent.setup();
    render(<TodoText {...defaultProps} isEditing={true} />);

    const input = screen.getByLabelText('Edit todo text');
    await user.type(input, '{enter}');

    expect(defaultProps.onSave).toHaveBeenCalled();
  });

  it('should call onCancel on Escape key', async () => {
    const user = userEvent.setup();
    render(<TodoText {...defaultProps} isEditing={true} />);

    const input = screen.getByLabelText('Edit todo text');
    await user.type(input, '{escape}');

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('should show error message when editError is present', () => {
    render(
      <TodoText
        {...defaultProps}
        isEditing={true}
        editError="Invalid todo text"
      />
    );

    expect(screen.getByText('Invalid todo text')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should disable input when saving', () => {
    render(<TodoText {...defaultProps} isEditing={true} isSaving={true} />);

    const input = screen.getByLabelText('Edit todo text');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('opacity-50');
  });
});