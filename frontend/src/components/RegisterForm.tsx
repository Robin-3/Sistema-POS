import { type FormEvent, useState } from "react";

export default function RegisterForm({ url }: { url: string }) {
  const [responseMessage, setResponseMessage] = useState("");
  const [responseOk, setResponseOk] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const password = formData.get('password') ?? undefined;
    const confirmPassword = formData.get('confirm-password') ?? undefined;
    if (typeof password === "undefined" || typeof confirmPassword === "undefined" || password !== confirmPassword) {
      setResponseOk(false);
      setResponseMessage("Las contraseñas no coinciden");
      return;
    }
    formData.delete('confirm-password');
    
    fetch(url, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((res) => {
      setResponseOk(res.ok);
      if (res.ok) {
        setResponseMessage("Vendedor registrado. Redirigiendo...");
        window.location.href = "/login";
      } else {
        setResponseMessage("Error al registrar vendedor");
      }
    });
  }

  return (
    <form className="max-w-sm mx-auto" onSubmit={submit}>
      <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-5">
        Registrar vendedor
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
          Nombres
          <input
            type="text"
            id="names"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="names"
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
      <div className="mb-5">
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Confirmar contraseña
          <input
            type="password"
            id="confirm-password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="confirm-password"
            required
          />
        </label>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Registrar vendedor
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
