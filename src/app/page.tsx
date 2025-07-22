import { TodoApp } from '@/components/todos/TodoApp';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <TodoApp />
      </ErrorBoundary>
    </div>
  );
}
