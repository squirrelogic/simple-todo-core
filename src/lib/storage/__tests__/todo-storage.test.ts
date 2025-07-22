import { todoStorage } from '../todo-storage';
import { TodoItem, FilterType } from '@/types/todo';

describe('TodoStorage', () => {
  const mockTodos: TodoItem[] = [
    {
      id: '1',
      text: 'Test todo 1',
      completed: false,
      createdAt: 1234567890,
      updatedAt: 1234567890,
    },
    {
      id: '2',
      text: 'Test todo 2',
      completed: true,
      createdAt: 1234567891,
      updatedAt: 1234567892,
    },
  ];

  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Clear console mocks
    jest.clearAllMocks();
    // Mock console.error to avoid test output noise
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('save', () => {
    it('should save todos and filter to localStorage', () => {
      const filter: FilterType = 'active';
      todoStorage.save(mockTodos, filter);

      const stored = localStorage.getItem('simple-todo-app');
      expect(stored).toBeDefined();
      
      const parsed = JSON.parse(stored!);
      expect(parsed).toEqual({
        version: 1,
        todos: mockTodos,
        filter: 'active',
      });
    });

    it('should handle empty todos array', () => {
      todoStorage.save([], 'all');

      const stored = localStorage.getItem('simple-todo-app');
      expect(stored).toBeDefined();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.todos).toEqual([]);
      expect(parsed.filter).toBe('all');
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw an error
      const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      // Should not throw
      expect(() => {
        todoStorage.save(mockTodos, 'all');
      }).not.toThrow();

      expect(console.error).toHaveBeenCalledWith(
        'Application Error:',
        expect.objectContaining({
          name: 'StorageError',
          code: 'STORAGE_ERROR'
        })
      );
    });
  });

  describe('load', () => {
    it('should load todos and filter from localStorage', () => {
      const data = {
        version: 1,
        todos: mockTodos,
        filter: 'completed' as FilterType,
      };
      localStorage.setItem('simple-todo-app', JSON.stringify(data));

      const result = todoStorage.load();
      expect(result).toEqual({
        todos: mockTodos,
        filter: 'completed',
      });
    });

    it('should return null if no data exists', () => {
      const result = todoStorage.load();
      expect(result).toBeNull();
    });

    it('should return null if version mismatch', () => {
      const data = {
        version: 2, // Future version
        todos: mockTodos,
        filter: 'all' as FilterType,
      };
      localStorage.setItem('simple-todo-app', JSON.stringify(data));

      const result = todoStorage.load();
      expect(result).toBeNull();
    });

    it('should handle missing fields gracefully', () => {
      const data = {
        version: 1,
        // Missing todos and filter
      };
      localStorage.setItem('simple-todo-app', JSON.stringify(data));

      const result = todoStorage.load();
      expect(result).toEqual({
        todos: [],
        filter: 'all',
      });
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('simple-todo-app', 'invalid json');

      const result = todoStorage.load();
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Application Error:',
        expect.objectContaining({
          name: 'UnknownError',
          code: 'UNKNOWN_ERROR'
        })
      );
    });

    it('should handle localStorage errors gracefully', () => {
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const result = todoStorage.load();
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'Application Error:',
        expect.objectContaining({
          name: 'UnknownError',
          code: 'UNKNOWN_ERROR'
        })
      );
    });
  });

  describe('clear', () => {
    it('should remove data from localStorage', () => {
      localStorage.setItem('simple-todo-app', 'some data');
      
      todoStorage.clear();
      
      expect(localStorage.getItem('simple-todo-app')).toBeNull();
    });

    it('should handle errors gracefully', () => {
      const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
      removeItemSpy.mockImplementation(() => {
        throw new Error('SecurityError');
      });

      // Should not throw
      expect(() => {
        todoStorage.clear();
      }).not.toThrow();

      expect(console.error).toHaveBeenCalledWith(
        'Application Error:',
        expect.objectContaining({
          name: 'UnknownError',
          code: 'UNKNOWN_ERROR'
        })
      );
    });
  });

  describe('getStorageSize', () => {
    it('should return size of stored data', () => {
      const data = {
        version: 1,
        todos: mockTodos,
        filter: 'all' as FilterType,
      };
      const jsonString = JSON.stringify(data);
      localStorage.setItem('simple-todo-app', jsonString);

      const size = todoStorage.getStorageSize();
      
      // Size should be the byte length of the JSON string
      const expectedSize = new Blob([jsonString]).size;
      expect(size).toBe(expectedSize);
    });

    it('should return 0 if no data exists', () => {
      const size = todoStorage.getStorageSize();
      expect(size).toBe(0);
    });

    it('should handle errors and return 0', () => {
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('SecurityError');
      });

      const size = todoStorage.getStorageSize();
      expect(size).toBe(0);
    });
  });

  describe('Storage key', () => {
    it('should use consistent storage key', () => {
      todoStorage.save(mockTodos, 'all');
      
      const keys = Object.keys(localStorage);
      expect(keys).toContain('simple-todo-app');
      expect(keys.length).toBe(1);
    });
  });

  describe('Data integrity', () => {
    it('should preserve todo data structure', () => {
      const complexTodo: TodoItem = {
        id: 'complex-123',
        text: 'Complex todo with special chars: !@#$%^&*()',
        completed: false,
        createdAt: Date.now(),
        updatedAt: Date.now() + 1000,
      };

      todoStorage.save([complexTodo], 'all');
      const result = todoStorage.load();

      expect(result?.todos[0]).toEqual(complexTodo);
    });

    it('should handle large datasets', () => {
      const largeTodoList: TodoItem[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `todo-${i}`,
        text: `Todo item number ${i} with some text`,
        completed: i % 2 === 0,
        createdAt: Date.now() - i * 1000,
        updatedAt: Date.now() - i * 500,
      }));

      todoStorage.save(largeTodoList, 'all');
      const result = todoStorage.load();

      expect(result?.todos).toHaveLength(1000);
      expect(result?.todos).toEqual(largeTodoList);
    });
  });
});