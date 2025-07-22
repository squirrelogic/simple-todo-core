'use client';

import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  const handleError = (error: Error) => {
    // Log app-level errors
    console.error('Application error:', error);
    
    // Could send to error monitoring service here
    // errorReporter.logError(error, { level: 'critical' });
  };

  const fallback = (error: Error, reset: () => void) => {
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <div className="text-center max-w-2xl">
          <div className="w-20 h-20 mx-auto mb-6 text-red-500">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Something went wrong
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            We&apos;re sorry, but the application encountered an unexpected error. 
            Please try refreshing the page or contact support if the problem persists.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-base font-medium"
              aria-label="Refresh page"
            >
              Refresh Page
            </button>
            
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-base font-medium ml-4"
              aria-label="Try again"
            >
              Try Again
            </button>
          </div>

          {isDevelopment && (
            <details className="mt-8 text-left max-w-full">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error details (Development only)
              </summary>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700">
                  {error.name}: {error.message}
                </p>
                <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-auto">
                  {error.stack}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}