import { useState, useEffect, useCallback } from 'react';

// Constants
const DEFAULT_CONFIRMATION_TIMEOUT = 3000;

interface UseConfirmationOptions {
  timeout?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}

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