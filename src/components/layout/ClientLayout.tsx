'use client';

import { ReactNode } from 'react';
import { DebugPanel } from '@/components/dev/DebugPanel';

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      {process.env.NODE_ENV === 'development' && <DebugPanel />}
    </>
  );
}