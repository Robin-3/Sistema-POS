import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

export const {
  ENV = "development",
  SALT_ROUNDS = 2,
  TOKEN,
  TOKEN_KEY
} = process.env;

export const PORT = parseInt(process.env.PORT) || 8080;
export const ACCEPTED_ORIGINS = process.env.ACCEPTED_ORIGINS.split(",");
export const FRONTEND_PATH = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "frontend",
  "dist",
  "client"
);

export const FILENAME_PATH = fileURLToPath(import.meta.url);
export const DIRNAME_PATH = path.dirname(FILENAME_PATH);
