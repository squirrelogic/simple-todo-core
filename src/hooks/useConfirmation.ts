import { useState, useEffect, useCallback } from 'react';

interface UseConfirmationOptions {
  timeout?: number;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function useConfirmation(options: UseConfirmationOptions = {}) {
  const { timeout = 3000, onConfirm, onCancel } = options;
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