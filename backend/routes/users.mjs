import express from 'express';
import { UserRepository } from '../repository/UserRepository.mjs';
import { ENV } from '../config.mjs';

const router = express.Router();

router.get('/users/:id', (req, res, next) => {
  const id = req.params.id;

  try {
    const user = UserRepository.getUser({ id });
    if (user) {
      res.send(user);
    } else {
      next();
    }
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(500).send('Error getting users');
  }
});

router.get('/users/:type?', (req, res, next) => {
  const type = req.params.type;

  try {
    if (!type || ['clients', 'sellers', 'suppliers'].includes(type)) {
      const users = UserRepository.getAllUsers({ type });
      res.send(users);
    } else {
      res.status(400).send('Invalid user type');
    }
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(500).send('Error getting users');
  }
});

router.post('/users/:type', async (req, res) => {
  const { type } = req.params;
  const {
    id,
    identification_id: identificationId,
    identification_number: identificationNumber,
    image,
    created_at: createdAt,
    updated_at: updatedAt,
    names,
    surnames,
    gender_id: genderId,
    role_id: roleId,
    password,
    tax_regime_code: taxRegimeCode,
    economic_activity_code: economicActivityCode,
    business_name: businessName
  } = req.body;

  try {
    let idUser;
    if (type === 'clients') {
      idUser = UserRepository.createClient({ id, identificationId, identificationNumber, image, createdAt, updatedAt, names, surnames, genderId });
    } else if (type === 'sellers') {
      idUser = await UserRepository.createSeller({ id, identificationId, identificationNumber, image, createdAt, updatedAt, names, surnames, genderId, roleId, password, taxRegimeCode, economicActivityCode });
    } else if (type === 'suppliers') {
      idUser = UserRepository.createSupplier({ id, identificationId, identificationNumber, image, createdAt, updatedAt, businessName });
    } else {
      res.status(400).send('Invalid user type');
    }

    res.send(UserRepository.getUser({ id: idUser }));
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(500).send('Error creating user');
  }
});

router.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const {
    identification_id: identificationId,
    identification_number: identificationNumber,
    image,
    created_at: createdAt,
    updated_at: updatedAt,
    names,
    surnames,
    gender_id: genderId,
    role_id: roleId,
    password,
    tax_regime_code: taxRegimeCode,
    economic_activity_code: economicActivityCode,
    business_name: businessName
  } = req.body;

  try {
    UserRepository.updateUser({ id, identificationId, identificationNumber, image, createdAt, updatedAt, names, surnames, genderId, roleId, password, taxRegimeCode, economicActivityCode, businessName });

    res.send(UserRepository.getUser({ id }));
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(500).send('Error updating user');
  }
});

router.delete('/users/:id', (req, res) => {
  const id = req.params.id;

  try {
    UserRepository.removeUser({ id });
    res.status(204).send();
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(500).send('Error removing user');
  }
});

router.delete('/users/:type/:id', (req, res) => {
  const { type, id } = req.params;

  try {
    if (type === 'clients') {
      UserRepository.removeClient({ id });
    } else if (type === 'sellers') {
      UserRepository.removeSeller({ id });
    } else if (type === 'suppliers') {
      UserRepository.removeSupplier({ id });
    } else {
      res.status(400).send('Invalid user type');
    }
    const userTypes = UserRepository.getUserTypes({ id });
    if (userTypes.length === 0) UserRepository.removeUser({ id });

    res.status(204).send();
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(500).send('Error removing user');
  }
});

export default router;
