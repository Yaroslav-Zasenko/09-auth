'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import * as clientApi from '@/lib/api/clientApi'; // або твій шлях до кліентського API
import { useRouter } from 'next/navigation';
import css from './Header.module.css';

export default function Header(): React.ReactElement {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth); // або метод для очищення сесії/виходу у сторі

  const handleLogout = async () => {
    try {
      await clientApi.logout(); // Виклик бекенду для видалення кук
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth(); // Очищаємо стор
      router.push('/sign-in'); // Перенаправляємо на сторінку входу
    }
  };

  return (
    <header className={css.header}>
      <Link href="/" className={css.headerLink} aria-label="Home">
        NoteHub
      </Link>
      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li className={css.navigationItem}>
            <Link href="/" className={css.navigationLink}>
              Home
            </Link>
          </li>

          {user ? (
            // Якщо користувач авторизований
            <>
              <li className={css.navigationItem}>
                <Link href="/notes/filter/all" className={css.navigationLink}>
                  Notes
                </Link>
              </li>
              <li className={css.navigationItem}>
                <Link href="/profile" className={css.navigationLink}>
                  Profile
                </Link>
              </li>
              <li className={css.navigationItem}>
                <button onClick={handleLogout} className={css.navigationLink} style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Якщо користувач НЕ авторизований
            <>
              <li className={css.navigationItem}>
                <Link href="/sign-in" className={css.navigationLink}>
                  Login
                </Link>
              </li>
              <li className={css.navigationItem}>
                <Link href="/sign-up" className={css.navigationLink}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}