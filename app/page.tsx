'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFirebaseAuth } from '@/lib/hooks/useFirebaseAuth';
import Header from '@/app/components/Header';
import Landing from '@/app/components/Landing';

export default function HomePage() {
  const { user, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleEnterApp = () => {
    router.push('/auth');
  };

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black min-h-screen">
      <Header onOpenWallet={handleEnterApp} />
      <Landing onOpenWallet={handleEnterApp} />
    </div>
  );
}


