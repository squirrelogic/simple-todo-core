import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoActions } from '../TodoActions';

describe('TodoActions', () => {
  const defaultProps = {
    isEditing: false,
    showDeleteConfirm: false,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    todoText: 'Test todo',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render edit and delete buttons', () => {
    render(<TodoActions {...defaultProps} />);

    expect(screen.getByLabelText('Edit "Test todo"')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete "Test todo"')).toBeInTheDocument();
  });

  it('should hide edit button when editing', () => {
    render(<TodoActions {...defaultProps} isEditing={true} />);

    expect(screen.queryByLabelText('Edit "Test todo"')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Delete "Test todo"')).toBeInTheDocument();
  });

  it('should call onEdit when edit button clicked', async () => {
    const user = userEvent.setup();
    render(<TodoActions {...defaultProps} />);

    await user.click(screen.getByLabelText('Edit "Test todo"'));
    expect(defaultProps.onEdit).toHaveBeenCalled();
  });

  it('should call onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    render(<TodoActions {...defaultProps} />);

    await user.click(screen.getByLabelText('Delete "Test todo"'));
    expect(defaultProps.onDelete).toHaveBeenCalled();
  });

  it('should show confirm delete styling', () => {
    render(<TodoActions {...defaultProps} showDeleteConfirm={true} />);

    const deleteButton = screen.getByLabelText('Confirm delete "Test todo"');
    expect(deleteButton).toHaveClass('text-red-600');
  });

  it('should have opacity transition on hover', () => {
    const { container } = render(<TodoActions {...defaultProps} />);

    const actionsDiv = container.firstChild;
    expect(actionsDiv).toHaveClass('opacity-0', 'group-hover:opacity-100', 'transition-opacity');
  });
});