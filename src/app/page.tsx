import { TodoApp } from '@/components/todos/TodoApp';
import { TodoErrorBoundary } from '@/components/errors';
import { ClientLayout } from '@/components/layout/ClientLayout';

export default function Home() {
  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50">
        <TodoErrorBoundary>
          <TodoApp />
        </TodoErrorBoundary>
      </div>
    </ClientLayout>
  );
}
