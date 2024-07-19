import express from 'express';
import { PORT } from './config.mjs';

const app = express();
app.use(express.json());
app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.post('/api', (req, res) => {
  res.json({ msg: 'Hello world!' });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
