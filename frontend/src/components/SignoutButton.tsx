import { type FormEvent, useState } from "react";

export default function LoginForm({ url }: { url: string }) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch(url, {
      method: "POST",
      credentials: "include"
    }).then((res) => {
      if (res.ok) {
        window.location.href = "./login";
      }
    });
  }

  return (
    <form onSubmit={submit}>
      <button
        type="submit"
        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
      >
        Cerrar sesión
      </button>
    </form>
  );
}
