'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import CallList from './CallList';

const queryClient = new QueryClient();

export default function ClientWrapper({ selectedEmployeeId }) {
  return (
    <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-10 space-y-10">
            <CallList selectedEmployeeId={selectedEmployeeId} />
        </div>
    </QueryClientProvider>
  );
}