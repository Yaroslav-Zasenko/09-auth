'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  // Додаємо стан для перевірки, чи компонент вже змонтувався на клієнті
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Редиректимо лише тоді, коли компонент змонтувався і точно немає користувача
    if (isMounted && !user) {
      router.replace('/sign-in');
    }
  }, [user, isMounted, router]);

  // Поки компонент не змонтувався або ми чекаємо перевірку — показуємо лоадер
  if (!isMounted || !user) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Перевірка авторизації...</p>;
  }

  return <>{children}</>;
}