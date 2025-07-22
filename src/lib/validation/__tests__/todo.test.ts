import { 
  validateTodoText, 
  sanitizeTodoText, 
  TODO_TEXT_MIN_LENGTH, 
  TODO_TEXT_MAX_LENGTH 
} from '../todo';

describe('Todo Validation', () => {
  describe('validateTodoText', () => {
    it('should validate normal text', () => {
      const result = validateTodoText('Buy groceries');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate text with leading/trailing spaces', () => {
      const result = validateTodoText('  Buy groceries  ');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty string', () => {
      const result = validateTodoText('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Todo text cannot be empty');
    });

    it('should reject string with only spaces', () => {
      const result = validateTodoText('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Todo text cannot be empty');
    });

    it('should validate text at minimum length', () => {
      const result = validateTodoText('a');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate text at maximum length', () => {
      const maxLengthText = 'a'.repeat(TODO_TEXT_MAX_LENGTH);
      const result = validateTodoText(maxLengthText);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject text exceeding maximum length', () => {
      const tooLongText = 'a'.repeat(TODO_TEXT_MAX_LENGTH + 1);
      const result = validateTodoText(tooLongText);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(`Todo text cannot exceed ${TODO_TEXT_MAX_LENGTH} characters`);
    });

    it('should handle special characters', () => {
      const specialText = '!@#$%^&*()_+-=[]{}|;:"<>?,./~`';
      const result = validateTodoText(specialText);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle unicode characters', () => {
      const unicodeText = '买杂货 🛒 📝 ✅';
      const result = validateTodoText(unicodeText);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should handle newlines and tabs', () => {
      const multilineText = 'Line 1\nLine 2\tTabbed';
      const result = validateTodoText(multilineText);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('sanitizeTodoText', () => {
    it('should trim whitespace', () => {
      const result = sanitizeTodoText('  Buy groceries  ');
      expect(result).toBe('Buy groceries');
    });

    it('should handle empty string', () => {
      const result = sanitizeTodoText('');
      expect(result).toBe('');
    });

    it('should handle string with only spaces', () => {
      const result = sanitizeTodoText('   ');
      expect(result).toBe('');
    });

    it('should preserve internal whitespace', () => {
      const result = sanitizeTodoText('  Buy  some  groceries  ');
      expect(result).toBe('Buy  some  groceries');
    });

    it('should truncate text exceeding maximum length', () => {
      const tooLongText = 'a'.repeat(TODO_TEXT_MAX_LENGTH + 50);
      const result = sanitizeTodoText(tooLongText);
      expect(result.length).toBe(TODO_TEXT_MAX_LENGTH);
      expect(result).toBe('a'.repeat(TODO_TEXT_MAX_LENGTH));
    });

    it('should handle text at exactly maximum length', () => {
      const maxLengthText = 'a'.repeat(TODO_TEXT_MAX_LENGTH);
      const result = sanitizeTodoText(maxLengthText);
      expect(result).toBe(maxLengthText);
    });

    it('should trim then truncate', () => {
      const longTextWithSpaces = '  ' + 'a'.repeat(TODO_TEXT_MAX_LENGTH + 10) + '  ';
      const result = sanitizeTodoText(longTextWithSpaces);
      expect(result.length).toBe(TODO_TEXT_MAX_LENGTH);
      expect(result).toBe('a'.repeat(TODO_TEXT_MAX_LENGTH));
    });

    it('should handle newlines and tabs', () => {
      const result = sanitizeTodoText('\n\tBuy groceries\n\t');
      expect(result).toBe('Buy groceries');
    });

    it('should preserve unicode characters', () => {
      const unicodeText = '  买杂货 🛒 📝 ✅  ';
      const result = sanitizeTodoText(unicodeText);
      expect(result).toBe('买杂货 🛒 📝 ✅');
    });
  });

  describe('Constants', () => {
    it('should have correct minimum length', () => {
      expect(TODO_TEXT_MIN_LENGTH).toBe(1);
    });

    it('should have correct maximum length', () => {
      expect(TODO_TEXT_MAX_LENGTH).toBe(255);
    });
  });
});