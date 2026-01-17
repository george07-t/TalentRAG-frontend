import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAccessToken, getRefreshToken } from '../lib/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const hasAnyToken = !!getAccessToken() || !!getRefreshToken();
    router.replace(hasAnyToken ? '/upload' : '/login');
  }, []);

  return null;
}
