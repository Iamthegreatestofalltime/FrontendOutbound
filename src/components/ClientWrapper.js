'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import AudioUploader from './AudioUploader';
import CallList from './CallList';

const queryClient = new QueryClient();

export default function ClientWrapper({ selectedEmployeeId }) {
  return (
    <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-10 space-y-10">
            <AudioUploader />
            <CallList selectedEmployeeId={selectedEmployeeId} />
        </div>
    </QueryClientProvider>
  );
}