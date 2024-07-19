import express from 'express';
import { ENV } from '../config.mjs';
import { UserRepository } from '../repository/database.mjs';

const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    identificationNumber = '',
    names = '',
    password = ''
  } = req.body;

  try {
    const id = await UserRepository.createSeller({ identificationNumber, names, password });
    res.send({ id });
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(400).send('Failed to register');
  }
});

export default router;
