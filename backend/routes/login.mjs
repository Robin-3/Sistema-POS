import express from 'express';
import jwt from 'jsonwebtoken';
import { ENV, TOKEN, TOKEN_KEY } from '../config.mjs';
import { UserRepository } from '../repository/UserRepository.mjs';

const router = express.Router();

router.post('/login', async (req, res) => {
  const {
    'identification-number': identificationNumber = '',
    password = ''
  } = req.body;

  try {
    const seller = await UserRepository.loginSeller({ identificationNumber, password });
    const token = jwt.sign(
      seller,
      TOKEN_KEY,
      { expiresIn: '1d' }
    );

    res
      .cookie(TOKEN, token, {
        httpOnly: true,
        secure: ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60
      })
      .send({ seller });
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(401).send('Failed to login');
  }
});

export default router;
