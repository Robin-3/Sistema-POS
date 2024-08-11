import crypto from "node:crypto";
import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config.mjs";
import { dbRepository } from "./dbRepository.mjs";
import { validations } from "./validations.mjs";

export class userRepository {
  /**
   * @param {{
   *   identificationTypeId: number;
   *   identificationNumber: string;
   *   password: string;
   * }} options
   * @returns {{
   *   id: string;
   *   names: string;
   *   surnames: string;
   *   image?: string;
   *   role: string;
   * }} seller
   */
  static async loginSeller({
    identificationTypeId,
    identificationNumber,
    password
  }) {
    validations.identificationNumber(identificationNumber);
    validations.password(password);

    const user = dbRepository.findOneTableData({
      tableName: "users",
      filter: {
        identification_id: identificationTypeId,
        identification_number: identificationNumber
      }
    });
    if (!user) throw new Error("User does not exist");

    const seller = dbRepository.findOneTableData({
      tableName: "sellers",
      filter: { _id: user._id }
    });
    if (!seller) throw new Error("Seller does not exist");

    const isValid = await bcrypt.compare(password, seller.password);
    if (!isValid) throw new Error("Password is incorrect");

    const role = dbRepository.findOneTableData({
      tableName: "list_role",
      filter: { _id: seller.role_id }
    });

    const s = {};
    s.id = seller._id;
    s.names = seller.names;
    s.surnames = seller.surnames;
    if (user.image) s.image = user.image;
    s.role = role.role;

    return s;
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
  static _allUsers() {
    const users = dbRepository
      .getTableData({ tableName: "users" })
      .map((user) => {
        user._tb_contacts = dbRepository
          .findTableData({
            tableName: "contacts_users",
            filter: { user_id: user._id }
          })
          .map((contact) => {
            contact._tb_contact = dbRepository.findOneTableData({
              tableName: "list_contact",
              filter: { _id: contact.contact_id }
            });
            return contact;
          });
        user._tb_identification = dbRepository.findOneTableData({
          tableName: "list_identification",
          filter: { _id: user.identification_id }
        });
        const client = dbRepository.findOneTableData({
          tableName: "clients",
          filter: { _id: user._id }
        });
        if (client) {
          client._tb_gender = dbRepository.findOneTableData({
            tableName: "list_gender",
            filter: { _id: client.gender_id }
          });
          user._tb_clients = client;
        }

        const seller = dbRepository.findOneTableData({
          tableName: "sellers",
          filter: { _id: user._id }
        });
        if (seller) {
          seller._tb_gender = dbRepository.findOneTableData({
            tableName: "list_gender",
            filter: { _id: seller.gender_id }
          });
          seller._tb_hierarchy = {};
          seller._tb_hierarchy._seller = dbRepository.findTableData({
            tableName: "seller_hierarchy",
            filter: { seller_id: seller._id }
          });
          seller._tb_hierarchy._top_seller = dbRepository.findTableData({
            tableName: "seller_hierarchy",
            filter: { top_seller_id: seller._id }
          });
          seller._tb_role = dbRepository.findOneTableData({
            tableName: "list_role",
            filter: { _id: seller.role_id }
          });
          user._tb_sellers = seller;
        }

        const supplier = dbRepository.findOneTableData({
          tableName: "suppliers",
          filter: { _id: user._id }
        });
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
   * @returns {('client' | 'supplier' | 'seller')[]} user types
   */
  static getUserTypes({ id }) {
    const userTypes = [];
    const client = dbRepository.findOneTableData({
      tableName: "clients",
      filter: { _id: id }
    });
    if (client) userTypes.push("client");
    const seller = dbRepository.findOneTableData({
      tableName: "sellers",
      filter: { _id: id }
    });

    if (seller) userTypes.push("seller");
    const supplier = dbRepository.findOneTableData({
      tableName: "suppliers",
      filter: { _id: id }
    });
    if (supplier) userTypes.push("supplier");

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
  static _getSellerPretty({ id }) {
    const user = dbRepository.findOneTableData({
      tableName: "users",
      filter: {
        _id: id,
        _tb_identification: {
          $ref: "list_identification",
          $id: "$data.identification_id"
        }
      }
    });
    const seller = dbRepository.findOneTableData({
      tableName: "sellers",
      filter: {
        _id: id,
        _tb_role: { $ref: "list_role", $id: "$data.role_id" }
      }
    });

    const s = {};
    s.id = id;
    s.identification = {
      code: seller._tb_identification.code,
      name: seller._tb_identification.identification,
      number: seller.identification_number
    };
    if (user.image) s.image = user.image;
    s.names = seller.names;
    s.surnames = seller.surnames ?? "";
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
  static _createUser({
    id,
    identificationId,
    identificationNumber,
    image,
    createdAt,
    updatedAt
  }) {
    if (!id) id = crypto.randomUUID();
    if (!createdAt) createdAt = Date.now();
    if (!updatedAt) updatedAt = Date.now();

    validations.user({
      id,
      identificationId,
      identificationNumber,
      image,
      createdAt,
      updatedAt
    });

    const u = {};
    u._id = id;
    u.identification_id = identificationId;
    u.identification_number = identificationNumber;
    if (image) u.image = image;
    u.created_at = createdAt;
    u.updated_at = updatedAt;

    dbRepository.insertRow({ tableName: "users", value: u });

    return id;
  }

  /**
   * @param {{
   *   type?: 'clients' | 'sellers' | 'suppliers';
   * }} options
   * @returns {{
   *   id: string;
   *   name: string;
   *   image?: string;
   *   role?: string;
   *   userType: ('client' | 'supplier' | 'seller')[];
   * }[]} allUsers
   */
  static getAllUsers({ type }) {
    const users = userRepository
      ._allUsers()
      .filter((user) => {
        if (!type) return true;

        const typeMapping = {
          clients: "_tb_clients",
          sellers: "_tb_sellers",
          suppliers: "_tb_suppliers"
        };

        return typeMapping[type] in user;
      })
      .map((user) => {
        const u = {};
        u.id = user._id;
        if (user.image) u.image = user.image;
        u.userType = [];
        if (user._tb_clients) {
          const names = user._tb_clients.names;
          const surnames = user._tb_clients.surnames ?? "";
          u.name = (names + " " + surnames).trim();
          u.userType.push("client");
        }
        if (user._tb_sellers) {
          const names = user._tb_sellers.names;
          const surnames = user._tb_sellers.surnames ?? "";
          u.name = (names + " " + surnames).trim();
          u.role = user._tb_sellers._tb_role.role;
          u.userType.push("seller");
        }
        if (user._tb_suppliers) {
          u.name = user._tb_suppliers.business_name;
          u.userType.push("supplier");
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
   *   seller?: {
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
   *   userType: ('client' | 'supplier' | 'seller')[];
   * } | null} user
   */
  static getUser({ id }) {
    const user = userRepository
      ._allUsers()
      .filter((user) => {
        return user._id === id;
      })
      .map((user) => {
        const u = {};
        u.id = user._id;
        u.identification = {
          code: user._tb_identification.code,
          name: user._tb_identification.identification,
          number: user.identification_number
        };
        if (user.image) u.image = user.image;
        u.created_at = user.created_at;
        u.contacts = user._tb_contacts.map((contact) => {
          return {
            contact: contact.contact,
            type: contact._tb_contact.contact
          };
        });
        u.userType = [];
        if (user._tb_clients) {
          u.names = user._tb_clients.names;
          u.surnames = user._tb_clients.surnames ?? "";
          u.gender = user._tb_clients._tb_gender.gender;
          u.userType.push("client");
        }
        if (user._tb_sellers) {
          u.names = user._tb_sellers.names;
          u.surnames = user._tb_sellers.surnames ?? "";
          u.gender = user._tb_sellers._tb_gender.gender;
          u.userType.push("seller");
          u.seller = {};
          u.seller.role = user._tb_sellers._tb_role.role;
          u.seller.topOf = user._tb_sellers._tb_hierarchy._seller.map(
            (seller) => {
              const s = userRepository._getSellerPretty({ id: seller._id });

              return s;
            }
          );
          if (user._tb_sellers.tax_regime_code)
            u.taxRegimeCode = user._tb_sellers.tax_regime_code;
          if (user._tb_sellers.economic_activity_code)
            u.economicActivityCode = user._tb_sellers.economic_activity_code;
        }
        if (user._tb_suppliers) {
          u.businessName = user._tb_suppliers.business_name;
          u.userType.push("supplier");
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
  static createClient({
    id,
    identificationId,
    identificationNumber,
    image,
    createdAt,
    updatedAt,
    names,
    surnames,
    genderId
  }) {
    // Puede generar un id, que exista dentro de usuarios pero con un tipo de usuario diferente
    const idExists = Boolean(id);
    if (!idExists) id = crypto.randomUUID();

    validations.client({ id, names, surnames, genderId });

    const user = idExists
      ? dbRepository.findOneTableData({
          tableName: "users",
          filter: { _id: id }
        })
      : undefined;

    const userId = user
      ? user._id
      : userRepository._createUser({
          id,
          identificationId,
          identificationNumber,
          image,
          createdAt,
          updatedAt
        });

    const c = {};
    c._id = userId;
    c.names = names;
    if (surnames) c.surnames = surnames;
    c.gender_id = genderId;

    dbRepository.insertRow({ tableName: "clients", value: c });

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
  static async createSeller({
    id,
    identificationId,
    identificationNumber,
    image,
    createdAt,
    updatedAt,
    names,
    surnames,
    genderId,
    roleId,
    password,
    taxRegimeCode,
    economicActivityCode
  }) {
    // Puede generar un id, que exista dentro de usuarios pero con un tipo de usuario diferente
    const idExists = Boolean(id);
    if (!idExists) id = crypto.randomUUID();

    validations.seller({
      id,
      names,
      surnames,
      genderId,
      roleId,
      password,
      taxRegimeCode,
      economicActivityCode
    });

    const user = idExists
      ? dbRepository.findOneTableData({
          tableName: "users",
          filter: { _id: id }
        })
      : undefined;

    const userId = user
      ? user._id
      : userRepository._createUser({
          id,
          identificationId,
          identificationNumber,
          image,
          createdAt,
          updatedAt
        });

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

    dbRepository.insertRow({ tableName: "sellers", value: s });

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
  static createSupplier({
    id,
    identificationId,
    identificationNumber,
    image,
    createdAt,
    updatedAt,
    businessName
  }) {
    // Puede generar un id, que exista dentro de usuarios pero con un tipo de usuario diferente
    const idExists = Boolean(id);
    if (!idExists) id = crypto.randomUUID();

    validations.supplier({ id, businessName });

    const user = idExists
      ? dbRepository.findOneTableData({
          tableName: "users",
          filter: { _id: id }
        })
      : undefined;

    const userId = user
      ? user._id
      : userRepository._createUser({
          id,
          identificationId,
          identificationNumber,
          image,
          createdAt,
          updatedAt
        });

    const s = {};
    s._id = userId;
    s.business_name = businessName;

    dbRepository.insertRow({ tableName: "suppliers", value: s });

    return userId;
  }

  /**
   * @param {{
   *   id: string;
   *   identificationId?: number;
   *   identificationNumber?: string;
   *   image?: string;
   *   createdAt?: number;
   *   updatedAt?: number;
   *   names?: string;
   *   surnames?: string;
   *   genderId?: number;
   *   roleId?: number;
   *   password?: string;
   *   taxRegimeCode?: string;
   *   economicActivityCode?: string;
   *   businessName?: string;
   * }} options
   * @returns {string} id
   */
  static updateUser({
    id,
    identificationId,
    identificationNumber,
    image,
    createdAt,
    updatedAt,
    names,
    surnames,
    genderId,
    roleId,
    password,
    taxRegimeCode,
    economicActivityCode,
    businessName
  }) {
    validations.update({
      id,
      identificationId,
      identificationNumber,
      image,
      createdAt,
      updatedAt,
      names,
      surnames,
      genderId,
      roleId,
      password,
      taxRegimeCode,
      economicActivityCode,
      businessName
    });

    const u = {};
    if (identificationId) u.identification_id = identificationId;
    if (identificationNumber) u.identification_number = identificationNumber;
    if (image) u.image = image;
    if (createdAt) u.created_at = createdAt;
    if (updatedAt) u.updated_at = updatedAt;
    dbRepository.updateRow({
      tableName: "users",
      filter: { _id: id },
      value: u
    });

    const userTypes = this.getUserTypes({ id });
    if (userTypes.includes("client")) {
      const c = {};
      if (names) c.names = names;
      if (surnames) c.surnames = surnames;
      if (genderId) c.gender_id = genderId;
      dbRepository.updateRow({
        tableName: "clients",
        filter: { _id: id },
        value: c
      });
    }
    if (userTypes.includes("seller")) {
      const s = {};
      if (names) s.names = names;
      if (surnames) s.surnames = surnames;
      if (genderId) s.gender_id = genderId;
      if (roleId) s.role_id = roleId;
      if (password) s.password = password;
      if (taxRegimeCode) s.tax_regime_code = taxRegimeCode;
      if (economicActivityCode) s.economic_activity_code = economicActivityCode;
      dbRepository.updateRow({
        tableName: "sellers",
        filter: { _id: id },
        value: s
      });
    }
    if (userTypes.includes("supplier")) {
      const s = {};
      if (businessName) s.business_name = businessName;
      dbRepository.updateRow({
        tableName: "suppliers",
        filter: { _id: id },
        value: s
      });
    }

    return id;
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   */
  static removeClient({ id }) {
    dbRepository.removeRow({ tableName: "clients", filter: { _id: id } });
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   */
  static removeSeller({ id }) {
    let hierarchyIds = dbRepository
      .findTableData({
        tableName: "seller_hierarchy",
        filter: { seller_id: id }
      })
      .contact(
        dbRepository.findTableData({
          tableName: "seller_hierarchy",
          filter: { top_seller_id: id }
        })
      )
      .map((row) => row._id);
    hierarchyIds = [...new Set(hierarchyIds)];
    dbRepository.removeRowsByIds({
      tableName: "seller_hierarchy",
      ids: hierarchyIds
    });

    dbRepository.removeRow({ tableName: "sellers", filter: { _id: id } });
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   */
  static removeSupplier({ id }) {
    dbRepository.removeRow({ tableName: "suppliers", filter: { _id: id } });
  }

  /**
   * @param {{
   *   id: string;
   * }} options
   */
  static removeUser({ id }) {
    const userTypes = this.getUserTypes({ id });
    if (userTypes.includes("client")) {
      dbRepository.removeRow({ tableName: "clients", filter: { _id: id } });
    }
    if (userTypes.includes("sellers")) {
      dbRepository.removeRow({ tableName: "sellers", filter: { _id: id } });
    }
    if (userTypes.includes("suppliers")) {
      dbRepository.removeRow({ tableName: "suppliers", filter: { _id: id } });
    }

    const contactIds = dbRepository
      .findTableData({
        tableName: "contacts_users",
        filter: { user_id: id }
      })
      .map((contact) => contact._id);
    dbRepository.removeRowsByIds({
      tableName: "contacts_users",
      ids: contactIds
    });

    dbRepository.removeRow({ tableName: "users", filter: { _id: id } });
  }
}
