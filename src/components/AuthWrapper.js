'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthWrapper = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.push('/auth');
    }
  }, [router]);

  return <>{children}</>;
};

export default AuthWrapper;