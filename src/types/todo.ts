export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';