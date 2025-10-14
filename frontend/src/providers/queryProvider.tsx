import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../shared/api/api';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
