'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import * as clientApi from '@/lib/api/clientApi';

export default function SignUpPage() {
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
      const user = await clientApi.register({ email, password });
      setUser(user);
      router.push('/notes/filter/all');
    } catch (err: unknown) {
      const errorMessage = 
        (err as { response?: { data?: { message?: string } } }).response?.data?.message || 
        'Помилка при реєстрації. Спробуйте інший email.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '400px', margin: '40px auto', padding: '20px' }}>
      <h1>Реєстрація у NoteHub</h1>
      
      {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

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
          {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
        </button>
      </form>

      <p style={{ marginTop: '20px' }}>
        Вже маєте акаунт? <Link href="/sign-in">Увійти</Link>
      </p>
    </main>
  );
}