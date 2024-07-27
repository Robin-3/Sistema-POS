import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import multer from 'multer';
import loginRouter from './routes/login.mjs';
import logoutRouter from './routes/logout.mjs';
import usersRouter from './routes/users.mjs';
import configDBRouter from './routes/configDB.mjs';
import { handler as astroHandler } from '../frontend/dist/server/entry.mjs';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { PORT, ENV, PATH, ACCEPTED_ORIGINS } from './config.mjs';

const app = express();
const upload = multer();

app.use(express.json());
app.use(cookieParser());
app.use(upload.none());
app.use(logger('dev'));
app.use(cors({
  origin: ACCEPTED_ORIGINS,
  methods: 'POST',
  credentials: true
}));

app.disable('x-powered-by');

app.use('/api', loginRouter);
app.use('/api', logoutRouter);
app.use('/api', usersRouter);
app.use('/api/db', configDBRouter);

if (ENV === 'development') {
  app.use(
    '/',
    createProxyMiddleware({
      target: 'http://localhost:4321',
      changeOrigin: true
    })
  );
} else {
  app.use(express.static(PATH));
  app.use(astroHandler);
}

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
