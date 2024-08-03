/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly TOKEN: string;
  readonly TOKEN_KEY: string;
  readonly URL_HOST: string;
  readonly URL_API_LOGIN: string;
  readonly URL_API_LOGOUT: string;
  readonly URL_API_USERS: string;
  readonly URL_API_LIST_IDENTIFICATIONS: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user: {
      id: string;
      names: string;
      surnames: string;
      image?: string;
      role: string;
    };
  }
}
