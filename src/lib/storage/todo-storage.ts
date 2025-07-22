import { TodoItem, FilterType } from '@/types/todo';
import { StorageError } from '@/types/errors';
import { trySync, logError } from '@/lib/errors/error-utils';

const STORAGE_KEY = 'simple-todo-app';
const STORAGE_VERSION = 1;

const isQuotaExceededError = (error: unknown): boolean => {
  if (!(error instanceof DOMException)) return false;
  
  // Check by name as error.code is deprecated
  return error.name === 'QuotaExceededError' ||
         error.name === 'NS_ERROR_DOM_QUOTA_REACHED';
};

interface StorageData {
  version: number;
  todos: TodoItem[];
  filter: FilterType;
}

export const todoStorage = {
  save(todos: TodoItem[], filter: FilterType): void {
    const result = trySync(() => {
      const data: StorageData = {
        version: STORAGE_VERSION,
        todos,
        filter,
      };
      const serialized = JSON.stringify(data);
      
      try {
        localStorage.setItem(STORAGE_KEY, serialized);
      } catch (storageError) {
        // Handle quota exceeded error
        if (isQuotaExceededError(storageError)) {
          throw new StorageError('Storage quota exceeded. Unable to save todos.', 'save');
        } else {
          throw storageError;
        }
      }
    });

    if (!result.success) {
      logError(result.error, { operation: 'save', itemCount: todos.length });
    }
  },

  load(): { todos: TodoItem[]; filter: FilterType } | null {
    const result = trySync(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const data: StorageData = JSON.parse(stored);
      
      // Handle version migrations if needed
      if (data.version !== STORAGE_VERSION) {
        // Future migration logic here
        return null;
      }

      return {
        todos: data.todos || [],
        filter: data.filter || 'all',
      };
    });

    if (!result.success) {
      logError(result.error, { operation: 'load' });
      return null;
    }

    return result.data;
  },

  clear(): void {
    const result = trySync(() => {
      localStorage.removeItem(STORAGE_KEY);
    });

    if (!result.success) {
      logError(result.error, { operation: 'clear' });
    }
  },

  getStorageSize(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? new Blob([stored]).size : 0;
    } catch {
      return 0;
    }
  },
};