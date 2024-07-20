import express from 'express';
import { TOKEN } from '../config.mjs';

const router = express.Router();

router.post('/logout', (req, res) => {
  res.clearCookie(TOKEN).send({ msg: 'Logout successful' });
});

export default router;
