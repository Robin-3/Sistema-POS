import express from 'express';
import { UserRepository } from '../repository/UserRepository.mjs';
import { ENV } from '../config.mjs';

const router = express.Router();

/*
| URL             | API    | DB     | Tarea                                        |
|-----------------|--------|--------|----------------------------------------------|
| `/users/:type?` | GET    | SELECT | Lista todos los usuarios                     |
| `/users/:id`    | GET    | SELECT | Obtiene la información general de un usuario |
| `/users/:id`    | DELETE | DELETE | Elimina a un usuario                         |

| `/users/[type]` | POST   | INSERT | Crea un nuevo usuario                        |
| `/users/[_id]`  | PATCH  | UPDATE | Actualiza la información de un usuario       |
*type*: clientes, sellers, suppliers
*/

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

router.delete('/users/:id', (req, res, next) => {
  const id = req.params.id;

  try {
    UserRepository.removeUser({ id });
    res.status(204).send();
  } catch (error) {
    if (ENV === 'development') console.error(error);
    res.status(500).send('Error removing user');
  }
});

export default router;
