import { TodoApp } from '@/components/todos/TodoApp';
import { TodoErrorBoundary } from '@/components/errors';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TodoErrorBoundary>
        <TodoApp />
      </TodoErrorBoundary>
    </div>
  );
}
