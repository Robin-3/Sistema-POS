import { type FormEvent, useState } from "react";

export default function LoginForm({ url }: { url: string }) {
  const [responseMessage, setResponseMessage] = useState("");
  const [responseOk, setResponseOk] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((res) => {
      setResponseOk(res.ok);
      if (res.ok) {
        setResponseMessage("Sesión iniciada. Redirigiendo...");
        window.location.href = "/";
      } else {
        setResponseMessage("Error al iniciar sesión");
      }
    });
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
