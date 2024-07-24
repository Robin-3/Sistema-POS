import express from 'express';
import { initialValuesRepository } from '../repository/initialValuesRepository.mjs';
import { ENV } from '../config.mjs';

const router = express.Router();

router.post('/initial-values', (req, res) => {
  try {
    initialValuesRepository.initValues();
    res.send('OK');
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(400).send('Failed to register');
  }
});

export default router;
