import { type FormEvent, useState } from "react";

export default function LoginForm({ url, user }: { url: string, user: { id: string, names: string, surnames: string } }) {
  const [responseMessage, setResponseMessage] = useState("");
  const [responseOk, setResponseOk] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(url, {
      method: "POST",
      credentials: "include"
    }).then((res) => {
      setResponseOk(res.ok);
      if (res.ok) {
        setResponseMessage("Cerrando sesión. Redirigiendo...");
        window.location.href = "./login";
      } else {
        setResponseMessage("Error al cerrar sesión");
      }
    });
  }

  return (
    <form className="max-w-sm mx-auto" onSubmit={submit}>
      <h2 className="text-gray-900 dark:text-white font-bold text-lg mb-5">
        Bienvenido { user.names }
      </h2>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Cerrar sesión
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
