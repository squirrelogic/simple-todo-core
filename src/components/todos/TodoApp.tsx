'use client';

import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { TodoFilter } from './TodoFilter';
import { TodoFooter } from './TodoFooter';

export function TodoApp() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Simple Todo
        </h1>
        
        <div className="space-y-4">
          <TodoInput />
          <TodoFilter />
        </div>
      </header>
      
      <main className="mb-4">
        <TodoList />
      </main>
      
      <footer>
        <TodoFooter />
      </footer>
    </div>
  );
}