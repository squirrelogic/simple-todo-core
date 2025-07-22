import { TodoItem, FilterType } from '@/types/todo';

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
    try {
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
          console.error('Storage quota exceeded. Unable to save todos.');
          // Could emit an event or callback here to notify the UI
        } else {
          throw storageError;
        }
      }
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  },

  load(): { todos: TodoItem[]; filter: FilterType } | null {
    try {
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
    } catch (error) {
      console.error('Failed to load todos from localStorage:', error);
      return null;
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear todos from localStorage:', error);
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