/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly TOKEN: string;
  readonly TOKEN_KEY: string;
  readonly URL_HOST: string;
  readonly URL_API_LOGIN: string;
  readonly URL_API_LOGOUT: string;
  readonly URL_API_REGISTER: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user: {
      id: string,
      names: string,
      surnames: string
    }
  }
}
