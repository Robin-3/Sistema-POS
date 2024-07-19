import dotenv from 'dotenv';

dotenv.config();

export const {
  ENV = 'development',
  SALT_ROUNDS = 2,
  TOKEN,
  TOKEN_KEY
} = process.env;

export const PORT = parseInt(process.env.PORT) || 8080;
