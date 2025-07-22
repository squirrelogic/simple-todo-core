export const TODO_TEXT_MIN_LENGTH = 1;
export const TODO_TEXT_MAX_LENGTH = 255;

export function validateTodoText(text: string): { isValid: boolean; error?: string } {
  const trimmedText = text.trim();
  
  if (trimmedText.length < TODO_TEXT_MIN_LENGTH) {
    return { isValid: false, error: 'Todo text cannot be empty' };
  }
  
  if (trimmedText.length > TODO_TEXT_MAX_LENGTH) {
    return { isValid: false, error: `Todo text cannot exceed ${TODO_TEXT_MAX_LENGTH} characters` };
  }
  
  return { isValid: true };
}

export function sanitizeTodoText(text: string): string {
  return text.trim().slice(0, TODO_TEXT_MAX_LENGTH);
}