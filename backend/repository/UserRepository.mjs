import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config.mjs';
import { Validations } from './Validations.mjs';
import { Users, Sellers, EnumIdentification, EnumRole, Clients, Suppliers, EnumGender, SellerHierarchy, ContactsUsers, EnumContact } from './database.mjs';

export class UserRepository {
  /**
   * @param {{
   *   identificationNumber: string;
   *   password: string;
   * }} options
   * @returns {{
   *   id: string;
   *   names: string;
   *   surnames: string;
   * }} seller
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

  /**
   * @returns {{
   *   _id: string;
   *   identification_id: number;
   *   identification_number: string;
   *   image?: string;
   *   created_at: number;
   *   updated_at: number;
   *   _tb_contacts: {
   *     _id: number;
   *     contact_id: number;
   *     user_id: string;
   *     contact: string;
   *     _tb_contact: {
   *       _id: number;
   *       contact: string;
   *     }
   *   }[];
   *   _tb_identification: {
   *     _id: number;
   *     code: string;
   *     identification: string;
   *   };
   *   _tb_clients?: {
   *     _id: string;
   *     names: string;
   *     surnames?: string;
   *     gender_id: number;
   *     _tb_gender: {
   *       _id: number;
   *       gender: string;
   *     };
   *   };
   *   _tb_sellers?: {
   *     _id: string;
   *     names: string;
   *     surnames?: string;
   *     gender_id: number;
   *     role_id: number;
   *     password: string;
   *     tax_regime_code?: string;
   *     economic_activity_code?: string;
   *     _tb_gender: {
   *       _id: number;
   *       gender: string;
   *     };
   *     _tb_hierarchy: {
   *       _seller: {
   *         _id: number;
   *         seller_id: text;
   *         top_seller_id: text;
   *       }[];
   *       _top_seller: {
   *         _id: number;
   *         seller_id: text;
   *         top_seller_id: text;
   *       }[];
   *     };
   *     _tb_role: {
   *       _id: number;
   *       role: string;
   *     };
   *   };
   *   _tb_suppliers?: {
   *     _id: string;
   *     business_name: string;
   *   };
   * }[]} allUsers
   */
  static _allUsers () {
    const users = Users
      .find()
      .map(user => {
        user._tb_contacts = ContactsUsers
          .find({ user_id: user._id })
          .map(contact => {
            contact._tb_contact = EnumContact.findOne({ _id: contact.contact_id });
            return contact;
          });
        user._tb_identification = EnumIdentification.findOne({ _id: user.identification_id });

        const client = Clients.findOne({ _id: user._id });
        if (client) {
          client._tb_gender = EnumGender.findOne({ _id: client.gender_id });
          user._tb_clients = client;
        }

        const seller = Sellers.findOne({ _id: user._id });
        if (seller) {
          seller._tb_gender = EnumGender.findOne({ _id: seller.gender_id });
          seller._tb_hierarchy = {};
          seller._tb_hierarchy._seller = SellerHierarchy.find({ seller_id: seller._id });
          seller._tb_hierarchy._top_seller = SellerHierarchy.find({ top_seller_id: seller._id });
          seller._tb_role = EnumRole.findOne({ _id: seller.role_id });
          user._tb_sellers = seller;
        }

        const supplier = Suppliers.findOne({ _id: user._id });
        if (supplier) {
          user._tb_suppliers = supplier;
        }

        return user;
      });

    return users;
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   * @returns {('Client' | 'Seller' | 'Supplier')[]} user types
   */
  static _getUserTypes ({ id }) {
    const userTypes = [];
    const client = Clients.findOne({ _id: id });
    if (client) userTypes.push('Client');
    const seller = Sellers.findOne({ _id: id });
    if (seller) userTypes.push('Seller');
    const supplier = Suppliers.findOne({ _id: id });
    if (supplier) userTypes.push('Supplier');

    return userTypes;
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   * @returns {{
   *   id: string;
   *   identification: {
   *     code: string;
   *     name: string;
   *     number: string;
   *   };
   *   names: string;
   *   surnames: string;
   *   image?: string;
   *   role: string;
   * }} Seller
   */
  static _getSellerPretty ({ id }) {
    const user = Users.findOne({ _id: id, _tb_identification: { $ref: 'enum_identification', $id: '$data.identification_id' } });
    const seller = Sellers.findOne({ _id: id, _tb_role: { $ref: 'enum_role', $id: '$data.role_id' } });

    const s = {};
    s.id = id;
    s.identification = {
      code: seller._tb_identification.code,
      name: seller._tb_identification.identification,
      number: seller.identification_number
    };
    if (user.image) s.image = user.image;
    s.names = seller.names;
    s.surnames = seller.surnames ?? '';
    s.role = seller._tb_role.role;

    return s;
  }

  /**
   * @param {{
   *   id?: string;
   *   identificationId: number;
   *   identificationNumber: string;
   *   image?: string;
   *   createdAt?: number;
   *   updatedAt?: number;
   * }} options
   * @returns {string} id
   */
  static _createUser ({ id, identificationId, identificationNumber, image, createdAt, updatedAt }) {
    if (!id) id = crypto.randomUUID();
    if (!createdAt) createdAt = Date.now();
    if (!updatedAt) updatedAt = Date.now();

    Validations.user({ id, identificationId, identificationNumber, image, createdAt, updatedAt });

    const u = {};
    u._id = id;
    u.identification_id = identificationId;
    u.identification_number = identificationNumber;
    if (image) u.image = image;
    u.created_at = createdAt;
    u.updated_at = updatedAt;

    Users.create(u).save();

    return id;
  }

  /**
   * @param {{
   *   type?: 'clients' | 'sellers' | 'suppliers';
   * }} options
   * @returns {{
   *   id: string;
   *   identification: {
   *     code: string;
   *     name: string;
   *     number: string;
   *   };
   *   name: string;
   *   image?: string;
   *   userType: ('Client' | 'Seller' | 'Supplier')[];
   * }[]} allUsers
   */
  static getAllUsers ({ type }) {
    const users = UserRepository._allUsers()
      .filter(user => {
        if (!type) return true;

        const typeMapping = {
          clients: '_tb_clients',
          sellers: '_tb_sellers',
          suppliers: '_tb_suppliers'
        };

        return typeMapping[type] in user;
      })
      .map(user => {
        const u = {};
        u.id = user._id;
        u.identification = {
          code: user._tb_identification.code,
          name: user._tb_identification.identification,
          number: user.identification_number
        };
        if (user.image) u.image = user.image;
        u.userType = [];
        if (user._tb_clients) {
          const names = user._tb_clients.names;
          const surnames = user._tb_clients.surnames ?? '';
          u.name = (names + ' ' + surnames).trim();
          u.userType.push('Client');
        }
        if (user._tb_sellers) {
          const names = user._tb_sellers.names;
          const surnames = user._tb_sellers.surnames ?? '';
          u.name = (names + ' ' + surnames).trim();
          u.userType.push('Seller');
        }
        if (user._tb_suppliers) {
          u.name = user._tb_suppliers.business_name;
          u.userType.push('Suppliers');
        }

        return u;
      });

    return users;
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   * @returns {{
   *   id: string;
   *   identification: {
   *     code: string;
   *     name: string;
   *     number: string;
   *   };
   *   image?: string;
   *   created_at: number;
   *   contacts: {
   *     contact: string;
   *     type: string;
   *   }[];
   *   names?: string;
   *   surnames?: string;
   *   businessName?: string;
   *   gender?: string;
   *   seller: {
   *     role: string;
   *     topOf: {
   *       id: string;
   *       identification: {
   *           code: string;
   *           name: string;
   *           number: string;
   *       };
   *       names: string;
   *       surnames: string;
   *       image?: string;
   *       role: string;
   *     }[];
   *   };
   *   taxRegimeCode?: string;
   *   economicActivityCode?: string;
   *   userType: ('Client' | 'Seller' | 'Supplier')[];
   * } | null} user
   */
  static getUser ({ id }) {
    const user = UserRepository._allUsers()
      .filter(user => {
        return user._id === id;
      })
      .map(user => {
        const u = {};
        u.id = user._id;
        u.identification = {
          code: user._tb_identification.code,
          name: user._tb_identification.identification,
          number: user.identification_number
        };
        if (user.image) u.image = user.image;
        u.created_at = user.created_at;
        u.contacts = user._tb_contacts
          .map(contact => {
            return {
              contact: contact.contact,
              type: contact._tb_contact.contact
            };
          });
        u.userType = [];
        if (user._tb_clients) {
          u.names = user._tb_clients.names;
          u.surnames = user._tb_clients.surnames ?? '';
          u.gender = user._tb_clients._tb_gender.gender;
          u.userType.push('Client');
        }
        if (user._tb_sellers) {
          u.names = user._tb_sellers.names;
          u.surnames = user._tb_sellers.surnames ?? '';
          u.gender = user._tb_sellers._tb_gender.gender;
          u.userType.push('Seller');
          u.seller = {};
          u.seller.role = user._tb_sellers._tb_role.role;
          u.seller.topOf = user._tb_sellers._tb_hierarchy._seller
            .map(seller => {
              const s = UserRepository._getSellerPretty({ id: seller._id });

              return s;
            });
          if (user._tb_sellers.tax_regime_code) u.taxRegimeCode = user._tb_sellers.tax_regime_code;
          if (user._tb_sellers.economic_activity_code) u.economicActivityCode = user._tb_sellers.economic_activity_code;
        }
        if (user._tb_suppliers) {
          u.businessName = user._tb_suppliers.business_name;
          u.userType.push('Suppliers');
        }

        return u;
      });
    return user.length === 0 ? null : user[0];
  }

  /**
   * @param {{
   *   id?: string;
   *   identificationId?: number;
   *   identificationNumber?: string;
   *   image?: string;
   *   createdAt?: number;
   *   updatedAt?: number;
   *   names: string;
   *   surnames?: string;
   *   genderId: number;
   * }} options
   * @returns {string} id
   */
  static createClient ({ id, identificationId, identificationNumber, image, createdAt, updatedAt, names, surnames, genderId }) {
    // Puede generar un id, que exista dentro de usuarios pero con un tipo de usuario diferente
    const idExists = Boolean(id);
    if (!idExists) id = crypto.randomUUID();

    Validations.client({ id, names, surnames, genderId });

    const user = idExists ? Users.findOne({ _id: id }) : undefined;
    const userId = user
      ? user._id
      : UserRepository._createUser({ id, identificationId, identificationNumber, image, createdAt, updatedAt });

    const c = {};
    c._id = userId;
    c.names = names;
    if (surnames) c.surnames = surnames;
    c.gender_id = genderId;

    Clients.create(c).save();

    return userId;
  }

  /**
   * @param {{
   *   id?: string;
   *   identificationId?: number;
   *   identificationNumber?: string;
   *   image?: string;
   *   createdAt?: number;
   *   updatedAt?: number;
   *   names: string;
   *   surnames?: string;
   *   genderId: number;
   *   roleId: number;
   *   password: string;
   *   taxRegimeCode?: string;
   *   economicActivityCode?: string;
   * }} options
   * @returns {string} id
   */
  static async createSeller ({ id, identificationId, identificationNumber, image, createdAt, updatedAt, names, surnames, genderId, roleId, password, taxRegimeCode, economicActivityCode }) {
    // Puede generar un id, que exista dentro de usuarios pero con un tipo de usuario diferente
    const idExists = Boolean(id);
    if (!idExists) id = crypto.randomUUID();

    Validations.seller({ id, names, surnames, genderId, roleId, password, taxRegimeCode, economicActivityCode });

    const user = idExists ? Users.findOne({ _id: id }) : undefined;
    const userId = user
      ? user._id
      : UserRepository._createUser({ id, identificationId, identificationNumber, image, createdAt, updatedAt });

    const salt = Number(SALT_ROUNDS);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const s = {};
    s._id = userId;
    s.names = names;
    if (surnames) s.surnames = surnames;
    s.gender_id = genderId;
    s.role_id = roleId;
    s.password = encryptedPassword;
    if (taxRegimeCode) s.tax_regime_code = taxRegimeCode;
    if (economicActivityCode) s.economic_activity_code = economicActivityCode;

    Sellers.create(s).save();

    return userId;
  }

  /**
   * @param {{
   *   id?: string;
   *   identificationId?: number;
   *   identificationNumber?: string;
   *   image?: string;
   *   createdAt?: number;
   *   updatedAt?: number;
   *   businessName: string;
   * }} options
   * @returns {string} id
   */
  static createSupplier ({ id, identificationId, identificationNumber, image, createdAt, updatedAt, businessName }) {
    // Puede generar un id, que exista dentro de usuarios pero con un tipo de usuario diferente
    const idExists = Boolean(id);
    if (!idExists) id = crypto.randomUUID();

    Validations.supplier({ id, businessName });

    const user = idExists ? Users.findOne({ _id: id }) : undefined;
    const userId = user
      ? user._id
      : UserRepository._createUser({ id, identificationId, identificationNumber, image, createdAt, updatedAt });

    const s = {};
    s._id = userId;
    s.business_name = businessName;

    Suppliers.create(s).save();

    return userId;
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   */
  static removeClient ({ id }) {
    const client = Clients.findOne({ _id: id });
    client.remove();
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   */
  static removeSeller ({ id }) {
    let hierarchyIds = [];
    SellerHierarchy.find({ seller_id: id })
      .forEach(seller => {
        hierarchyIds.push(seller._id);
      });
    SellerHierarchy.find({ top_seller_id: id })
      .forEach(seller => {
        hierarchyIds.push(seller._id);
      });
    hierarchyIds = [...new Set(hierarchyIds)];
    for (const id of hierarchyIds) {
      const seller = SellerHierarchy.findOne({ _id: id });
      seller.remove();
    }

    const seller = Sellers.findOne({ _id: id });
    seller.remove();
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   */
  static removeSupplier ({ id }) {
    const supplier = Suppliers.findOne({ _id: id });
    supplier.remove();
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   */
  static removeUser ({ id }) {
    const client = Clients.findOne({ _id: id });
    if (client) UserRepository.removeClient({ id });
    const seller = Sellers.findOne({ _id: id });
    if (seller) UserRepository.removeSeller({ id });
    const supplier = Suppliers.findOne({ _id: id });
    if (supplier) UserRepository.removeSupplier({ id });

    const contactIds = ContactsUsers.find({ user_id: id })
      .map(contact => contact._id);
    for (const id of contactIds) {
      const contact = ContactsUsers.findOne({ _id: id });
      contact.remove();
    }

    const user = Users.findOne({ _id: id });
    user.remove();
  }
}
