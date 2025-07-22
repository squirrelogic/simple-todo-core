import { useState, useEffect, useCallback } from 'react';

// Constants
const DEFAULT_CONFIRMATION_TIMEOUT = 3000;

/**
 * Options for the useConfirmation hook
 */
interface UseConfirmationOptions {
  /** Timeout in milliseconds before auto-canceling (default: 3000) */
  timeout?: number;
  /** Callback when confirmation is accepted */
  onConfirm?: () => void;
  /** Callback when confirmation is canceled */
  onCancel?: () => void;
}

/**
 * Hook for managing confirmation state for destructive actions
 * 
 * @param {UseConfirmationOptions} options - Configuration options
 * @returns {object} Confirmation state and control functions
 * 
 * @example
 * const deleteConfirmation = useConfirmation({
 *   onConfirm: () => deleteTodo(id),
 *   timeout: 5000
 * });
 * 
 * // In your component
 * <button onClick={deleteConfirmation.requestConfirmation}>
 *   Delete
 * </button>
 * {deleteConfirmation.showConfirmation && (
 *   <button onClick={deleteConfirmation.confirm}>
 *     Confirm Delete
 *   </button>
 * )}
 */
export function useConfirmation(options: UseConfirmationOptions = {}) {
  const { timeout = DEFAULT_CONFIRMATION_TIMEOUT, onConfirm, onCancel } = options;
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Auto-cancel confirmation after timeout
  useEffect(() => {
    if (showConfirmation && timeout > 0) {
      const timer = setTimeout(() => {
        setShowConfirmation(false);
        onCancel?.();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [showConfirmation, timeout, onCancel]);

  const requestConfirmation = useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const confirm = useCallback(() => {
    setShowConfirmation(false);
    onConfirm?.();
  }, [onConfirm]);

  const cancel = useCallback(() => {
    setShowConfirmation(false);
    onCancel?.();
  }, [onCancel]);

  return {
    showConfirmation,
    requestConfirmation,
    confirm,
    cancel,
  };
}