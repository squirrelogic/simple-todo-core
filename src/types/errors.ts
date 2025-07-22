/**
 * Base error class for all application errors
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, unknown>;

  constructor(message: string, code: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    this.context = context;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Validation error for invalid user input
 */
export class ValidationError extends AppError {
  constructor(message: string, field?: string, value?: unknown) {
    super(message, 'VALIDATION_ERROR', { field, value });
  }
}

/**
 * Storage error for persistence failures
 */
export class StorageError extends AppError {
  constructor(message: string, operation?: string) {
    super(message, 'STORAGE_ERROR', { operation });
  }
}

/**
 * Network error for API failures
 */
export class NetworkError extends AppError {
  public readonly status?: number;
  
  constructor(message: string, status?: number, endpoint?: string) {
    super(message, 'NETWORK_ERROR', { status, endpoint });
    this.status = status;
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id: string | number) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', { resource, id });
  }
}

/**
 * Permission error for unauthorized access
 */
export class PermissionError extends AppError {
  constructor(message: string, action?: string, resource?: string) {
    super(message, 'PERMISSION_ERROR', { action, resource });
  }
}

/**
 * Unknown error wrapper for unexpected errors
 */
export class UnknownError extends AppError {
  public readonly originalError: unknown;
  
  constructor(message: string, originalError: unknown) {
    super(message, 'UNKNOWN_ERROR');
    this.originalError = originalError;
  }
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E = AppError> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Helper to create successful results
 */
export const success = <T>(data: T): Result<T> => ({
  success: true,
  data
});

/**
 * Helper to create failed results
 */
export const failure = <E = AppError>(error: E): Result<never, E> => ({
  success: false,
  error
});