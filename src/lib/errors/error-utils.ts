import {
  AppError,
  StorageError,
  ValidationError,
  NetworkError,
  UnknownError,
  Result,
  success,
  failure
} from '@/types/errors';

/**
 * Type guards for error types
 */
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isStorageError = (error: unknown): error is StorageError => {
  return error instanceof StorageError;
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};

export const isUnknownError = (error: unknown): error is UnknownError => {
  return error instanceof UnknownError;
};

/**
 * Convert unknown errors to AppError
 */
export const normalizeError = (error: unknown): AppError => {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    // Check for quota exceeded errors
    if (
      error.name === 'QuotaExceededError' ||
      error.message.includes('QuotaExceededError') ||
      error.message.toLowerCase().includes('quota') ||
      error.message.toLowerCase().includes('storage')
    ) {
      return new StorageError(error.message, 'persist');
    }

    // Check for network errors
    if (
      error.name === 'NetworkError' ||
      error.message.toLowerCase().includes('fetch') ||
      error.message.toLowerCase().includes('network')
    ) {
      return new NetworkError(error.message);
    }

    // Wrap other errors
    return new UnknownError(error.message, error);
  }

  // Handle non-Error objects
  const message = String(error);
  return new UnknownError(message, error);
};

/**
 * Get user-friendly error message
 */
export const getUserMessage = (error: AppError): string => {
  switch (error.code) {
    case 'VALIDATION_ERROR':
      return error.message;
    case 'STORAGE_ERROR':
      return 'Failed to save your changes. Please try again.';
    case 'NETWORK_ERROR':
      return 'Network connection failed. Please check your internet connection.';
    case 'NOT_FOUND':
      return 'The requested item could not be found.';
    case 'PERMISSION_ERROR':
      return 'You do not have permission to perform this action.';
    case 'UNKNOWN_ERROR':
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Execute an async operation and return a Result
 * @template T - The expected return type of the operation
 * @param {() => Promise<T>} operation - Async function to execute
 * @returns {Promise<Result<T>>} Success with data or failure with error
 * @example
 * const result = await tryAsync(async () => {
 *   const response = await fetch('/api/todos');
 *   return response.json();
 * });
 * 
 * if (result.success) {
 *   console.log(result.data);
 * } else {
 *   console.error(result.error.message);
 * }
 */
export const tryAsync = async <T>(
  operation: () => Promise<T>
): Promise<Result<T>> => {
  try {
    const data = await operation();
    return success(data);
  } catch (error) {
    return failure(normalizeError(error));
  }
};

/**
 * Execute a sync operation and return a Result
 * @template T - The expected return type of the operation
 * @param {() => T} operation - Synchronous function to execute
 * @returns {Result<T>} Success with data or failure with error
 * @example
 * const result = trySync(() => JSON.parse(jsonString));
 * if (!result.success) {
 *   console.error('Invalid JSON:', result.error.message);
 * }
 */
export const trySync = <T>(operation: () => T): Result<T> => {
  try {
    const data = operation();
    return success(data);
  } catch (error) {
    return failure(normalizeError(error));
  }
};

/**
 * Retry an operation with exponential backoff
 * @template T - The expected return type of the operation
 * @param {() => Promise<T>} operation - Async operation to retry
 * @param {object} options - Retry configuration
 * @param {number} [options.maxRetries=3] - Maximum number of retry attempts
 * @param {number} [options.initialDelay=1000] - Initial delay in milliseconds
 * @param {number} [options.maxDelay=10000] - Maximum delay between retries
 * @param {(error: AppError) => boolean} [options.shouldRetry] - Function to determine if retry should occur
 * @returns {Promise<Result<T>>} Final result after retries
 * @example
 * const result = await retryWithBackoff(
 *   () => fetch('/api/todos'),
 *   { maxRetries: 5, initialDelay: 500 }
 * );
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: AppError) => boolean;
  } = {}
): Promise<Result<T>> => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => isNetworkError(error)
  } = options;

  let lastError: AppError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const result = await tryAsync(operation);
    
    if (result.success) {
      return result;
    }

    lastError = result.error;

    // Check if we should retry
    if (attempt === maxRetries || !shouldRetry(result.error)) {
      return result;
    }

    // Calculate delay with exponential backoff
    const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  return failure(lastError || new UnknownError('Operation failed after retries', null));
};

/**
 * Log error with context
 */
export const logError = (error: AppError, additionalContext?: Record<string, unknown>): void => {
  const errorInfo = {
    name: error.name,
    message: error.message,
    code: error.code,
    timestamp: error.timestamp,
    stack: error.stack,
    context: {
      ...error.context,
      ...additionalContext
    }
  };

  // Always log in test environment for easier testing
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    console.error('Application Error:', errorInfo);
  } else {
    // In production, send to error reporting service
    // errorReporter.report(errorInfo);
  }
};

/**
 * Create error handlers for common patterns
 */
export const createErrorHandler = (
  context: string,
  options: {
    onError?: (error: AppError) => void;
    fallbackValue?: unknown;
    rethrow?: boolean;
  } = {}
) => {
  return (error: unknown) => {
    const appError = normalizeError(error);
    logError(appError, { context });

    if (options.onError) {
      options.onError(appError);
    }

    if (options.rethrow) {
      throw appError;
    }

    return options.fallbackValue;
  };
};