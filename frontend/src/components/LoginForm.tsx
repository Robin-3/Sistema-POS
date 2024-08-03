import { type FormEvent, useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Toast from "./Toast";

export default function LoginForm({
  url,
  isDev,
  identificationList
}: {
  url: string;
  isDev: boolean;
  identificationList: {
    id: string;
    code: string;
  }[];
}) {
  const [showToast, setShowToast] = useState(false);
  const [typeToast, setTypeToast] = useState<"info" | "danger" | "success">(
    "info"
  );
  const [messageToast, setMessageToast] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isDev) {
      const session = localStorage.getItem("session");
      if (session) {
        sessionRecovery(session);
      }
    }
  }, [isDev, url]);

  const sessionRecovery = async (session: string) => {
    setToast("info", "Recuperando sesión");
    const { token, createdAt } = JSON.parse(session);
    const limit = 24 * 60 * 60 * 1000 + createdAt;

    if (Date.now() <= limit) {
      const formData = new FormData();
      formData.append("token", JSON.stringify(token));

      try {
        const res = await fetch(`${url}/session`, {
          method: "POST",
          credentials: "include",
          body: formData
        });

        setShowToast(false);
        if (res.ok) {
          setToast("success", "Sesión recuperada");
          window.location.href = "/";
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setToast("danger", "Error al recuperar la sesión");
      }
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      if (!response.ok) {
        setToast("danger", "Error al iniciar sesión");
        return;
      }

      setToast("success", "Sesión iniciada");

      if (isDev) {
        const data = await response.json();
        localStorage.setItem(
          "session",
          JSON.stringify({
            token: data,
            createdAt: Date.now()
          })
        );
      }

      window.location.href = "/";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setToast("danger", "Error de red al iniciar sesión");
    }
  };

  const setToast = (type: "info" | "danger" | "success", message: string) => {
    setShowToast(true);
    setTypeToast(type);
    setMessageToast(message);
  };

  return (
    <>
      <form className="max-w-sm mx-auto" onSubmit={submit}>
        <label
          htmlFor="identification-number"
          className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Identificación
        </label>
        <div className="flex">
          <select
            id="identification-type"
            name="identification-type"
            className="flex-shrink-0 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
            required
          >
            {identificationList.map(({ id, code }) => (
              <option key={id} value={id}>
                {code}
              </option>
            ))}
          </select>
          <input
            type="text"
            id="identification-number"
            name="identification-number"
            className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg rounded-s-gray-100 rounded-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
            required
          />
        </div>
        <label
          htmlFor="password"
          className="block my-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Contraseña
        </label>
        <div className="flex">
          <span
            className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </span>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="my-4 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Iniciar sesión
          </button>
        </div>
      </form>
      {showToast && (
        <Toast type={typeToast} message={messageToast} duration={3000} />
      )}
    </>
  );
}
