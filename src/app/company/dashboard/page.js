'use client';

import { useState } from 'react';
import CompanyWrapper from '@/components/CompanyWrapper';
import CompanyDashboard from '@/components/CompanyDashboard';

export default function Home() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployeeId(employee ? employee._id : null);
  };

  return (
    <main>
      <CompanyDashboard onEmployeeSelect={handleEmployeeSelect} />
      <CompanyWrapper selectedEmployeeId={selectedEmployeeId} />
    </main>
  );
}