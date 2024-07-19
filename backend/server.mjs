import express from 'express';
import cookieParser from 'cookie-parser';
import loginRouter from './routes/login.mjs';
import registerRouter from './routes/register.mjs';
import { PORT } from './config.mjs';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.disable('x-powered-by');

app.use('/api', loginRouter);
app.use('/api', registerRouter);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
