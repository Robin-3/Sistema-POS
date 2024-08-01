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

    if (ENV === 'development') {
      res
        .cookie(TOKEN, token, {
          httpOnly: true,
          secure: ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60
        })
        .send({ [TOKEN]: token });
    } else {
      res
        .cookie(TOKEN, token, {
          httpOnly: true,
          secure: ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60
        })
        .status(204)
        .send();
    }
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(401).send('Failed to login');
  }
});

if (ENV === 'development') {
  router.post('/login/session', (req, res) => {
    const {
      token: tokenAsString
    } = req.body;
    if (tokenAsString) {
      const token = JSON.parse(tokenAsString);
      res
        .cookie(TOKEN, token[TOKEN], {
          httpOnly: true,
          secure: ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60
        })
        .status(204)
        .send();
    } else {
      res.status(403).send();
    }
  });
}

export default router;
