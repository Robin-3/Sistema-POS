import { type MouseEvent, useState } from 'react';
import Toast from './Toast';

export default function LogoutButton ({ url, isDev }: { url: string; isDev: boolean }) {
  const [showToast, setShowToast] = useState(false);

  const submit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    fetch(url, {
      method: 'POST',
      credentials: 'include'
    }).then((res) => {
      if (res.ok) {
        if (isDev) localStorage.removeItem('session');

        setShowToast(true);
        window.location.href = './login';
      }
    });
  };

  return (
    <>
      <button
        onClick={submit}
        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
      >
        Cerrar sesión
      </button>
      {showToast && <Toast type="success" message="Cerrando sesión" duration={3000} />}
    </>
  );
}
