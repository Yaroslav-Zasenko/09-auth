'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore'; // або шлях до твого стору авторизації
import * as clientApi from '@/lib/api/clientApi';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Виклик методу логіну на бекенд
      const user = await clientApi.login({ email, password });
      setUser(user); // Зберігаємо користувача в сторі
      router.push('/notes/filter/all'); // Перенаправляємо на сторінку нотаток
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка при вході. Перевірте дані.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <h1>Вхід у NoteHub</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button type="submit" disabled={isLoading} style={{ padding: '10px', cursor: 'pointer' }}>
          {isLoading ? 'Вхід...' : 'Увійти'}
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        Ще не маєте акаунта? <Link href="/register">Зареєструватися</Link>
      </p>
    </main>
  );
}