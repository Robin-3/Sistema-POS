import { type FormEvent, useState, useEffect } from 'react';
import Toast from './Toast';

export default function LoginForm ({ url, isDev }: { url: string, isDev: boolean }) {
  const [showToast, setShowToast] = useState(false);
  const [typeToast, setTypeToast] = useState<'info' | 'danger' | 'success'>('info');
  const [messageToast, setMessageToast] = useState('');

  useEffect(() => {
    if (isDev) {
      const session = localStorage.getItem('session');
      if (session) {
        setShowToast(true);
        setTypeToast('info');
        setMessageToast('Recuperando sesión');
        const { token, createdAt } = JSON.parse(session) as {
          token: { tokenName: string };
          createdAt: number;
        };
        const limit = 24 * 60 * 60 * 1000 + createdAt;
        if (Date.now() <= limit) {
          const formData = new FormData();
          formData.append('token', JSON.stringify(token));
          console.log({ token });

          fetch(url + '/session', {
            method: 'POST',
            credentials: 'include',
            body: formData
          }).then(res => {
            setShowToast(false);
            if (res.ok) {
              setShowToast(true);
              setTypeToast('success');
              setMessageToast('Sesión recuperada');

              window.location.href = '/';
            }
          });
        }
      }
    }
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    console.log(formData);

    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    setShowToast(true);
    if (!response.ok) {
      setTypeToast('danger');
      setMessageToast('Error al iniciar sesión');
      return;
    }

    setTypeToast('success');
    setMessageToast('Sesión iniciada');

    if (isDev) {
      const data = await response.json();
      localStorage.setItem('session', JSON.stringify({
        token: data,
        createdAt: Date.now()
      }));
    }

    window.location.href = '/';
  };

  return (
    <>
      <form className="max-w-sm mx-auto" onSubmit={submit}>
        <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-5">
          Inicio de sesión
        </h2>
        <div className="mb-5">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Número de Identificación
            <input
              type="text"
              id="identification-number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="identification-number"
              required
            />
          </label>
        </div>
        <div className="mb-5">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Contraseña
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="password"
              required
            />
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Iniciar sesión
        </button>
      </form>
      {showToast && <Toast type={typeToast} message={messageToast} duration={3000} />}
    </>
  );
}
