import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config.mjs';
import { Validations } from './Validations.mjs';
import { Users, Sellers } from './database.mjs';

export class UserRepository {
  /**
   * @param {Object} options
   * @param {string} options.identificationNumber
   * @returns {string} id
   */
  static createUser ({ identificationNumber }) {
    Validations.identificationNumber(identificationNumber);

    // TODO: Validar que el número y el tipo de documento ya existan
    const user = Users.findOne({ identification_number: identificationNumber });
    if (user) throw new Error('The user already exists');

    const id = crypto.randomUUID();

    Users.create({
      _id: id,
      identification_id: 2, // TODO: ajustar el tipo de identificación
      identification_number: identificationNumber,
      image: '', // TODO: añadir la url de imagen
      created_at: Date.now(),
      updated_at: Date.now()
    }).save();

    return id;
  }

  /**
   * @param {Object} options
   * @param {string} options.identificationNumber
   * @param {string} options.names
   * @param {string} [options.surnames=''] options.surnames
   * @param {string} options.password
   * @returns {string} id
   */
  static async createSeller ({ identificationNumber, names, surnames = '', password }) {
    Validations.names(names);
    Validations.surnames(surnames);
    Validations.password(password);

    const userId = UserRepository.createUser({ identificationNumber });
    const salt = Number(SALT_ROUNDS);
    const encryptedPassword = await bcrypt.hash(password, salt);

    Sellers.create({
      _id: userId,
      names,
      surnames,
      gender_id: 3, // TODO: ajustar el tipo de genero
      role_id: 2, // TODO: ajustar el tipo de rol
      password: encryptedPassword
    }).save();

    return userId;
  }

  /**
   * @param {Object} options
   * @param {string} options.identificationNumber
   * @param {string} options.password
   * @returns {{id: string, names: string, surnames: string}} seller
   */
  static async loginSeller ({ identificationNumber, password }) {
    Validations.identificationNumber(identificationNumber);
    Validations.password(password);

    const user = Users.findOne({ identification_number: identificationNumber });
    if (!user) throw new Error('User does not exist');

    const seller = Sellers.findOne({ _id: user._id });
    if (!seller) throw new Error('Seller does not exist');

    const isValid = await bcrypt.compare(password, seller.password);
    if (!isValid) throw new Error('Password is incorrect');

    const { _id, names, surnames } = seller;

    return {
      id: _id,
      names,
      surnames
    };
  }
}
