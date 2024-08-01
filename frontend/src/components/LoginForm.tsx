import { type FormEvent, useState, useEffect } from "react";

export default function LoginForm({ url, isDev }: { url: string, isDev: boolean }) {
  const [responseMessage, setResponseMessage] = useState("");
  const [responseOk, setResponseOk] = useState(false);

  useEffect(() => {
    if (isDev) {
      const session = localStorage.getItem('session');
      if (session) {
        const { token, createdAt } = JSON.parse(session) as { token: any, createdAt: number };
        const limit = 24 * 60 * 60 * 1000 + createdAt;
        if (Date.now() <= limit) {
          const formData = new FormData();
          formData.append("token", JSON.stringify(token));
          console.log({ token });

          fetch(url+"/session", {
            method: "POST",
            credentials: "include",
            body: formData,
          }).then(res => {
            if (res.ok) {
              setResponseOk(true);
              setResponseMessage("Sesión iniciada. Redirigiendo...");
              window.location.href = "/";
            }
          });
        }
      }
    }
  }, []);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    setResponseOk(response.ok);
    if (!response.ok) {
      setResponseMessage("Error al iniciar sesión");
      return;
    }
    setResponseMessage("Sesión iniciada. Redirigiendo...");
    window.location.href = "/";
    if (isDev) {
      const data = await response.json();
      localStorage.setItem('session', JSON.stringify({
        token: data,
        createdAt: Date.now()
      }));
    }
  }

  return (
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
      {responseMessage &&
        <p
          className={responseOk
            ? "mt-2 text-sm text-green-600 dark:text-green-500"
            : "mt-2 text-sm text-red-600 dark:text-red-500"}
        >
          {responseMessage}
        </p>
      }
    </form>
  );
}
