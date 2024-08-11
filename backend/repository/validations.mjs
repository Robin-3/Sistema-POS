import { z } from "zod";
import {
  Clients,
  ListGender,
  ListIdentification,
  ListRole,
  Sellers,
  Suppliers,
  Users
} from "./database.mjs";

export class validations {
  /**
   * Valida un UUID.
   * @param {string} id - El UUID a validar.
   * @throws {z.ZodError} - Si el UUID no es válido.
   */
  static id(id) {
    const idSchema = z
      .string()
      .uuid({ message: "The ID must have a valid UUID syntax" });
    idSchema.parse(id);
  }

  /**
   * Valida un ID de identificación.
   * @param {number} identificationId - El ID de identificación a validar.
   * @throws {z.ZodError|Error} - Si el ID no es válido o no existe.
   */
  static identificationId(identificationId) {
    const identificationSchema = z
      .number()
      .int({ message: "The identification ID must be an integer" });
    identificationSchema.parse(identificationId);

    const identification = ListIdentification.findOne({
      _id: identificationId
    });
    if (!identification) throw new Error("Identification does not exist");
  }

  /**
   * Valida un número de identificación.
   * @param {string} identificationNumber - El número de identificación a validar.
   * @throws {z.ZodError} - Si el número no es válido.
   */
  static identificationNumber(identificationNumber) {
    const numberSchema = z.string().min(3, {
      message: "The identification number must be more than 3 characters"
    });
    numberSchema.parse(identificationNumber);
  }

  /**
   * Valida una imagen.
   * @param {string|undefined} image - La imagen a validar.
   * @throws {z.ZodError} - Si la imagen no es válida.
   */
  static image(image) {
    const imageSchema = z
      .string()
      // todo eliminar url
      .url({ message: "The image must have a valid URL syntax" })
      .optional();
    imageSchema.parse(image);
  }

  /**
   * Valida un timestamp.
   * @param {number} timestamp - El timestamp a validar.
   * @throws {z.ZodError} - Si el timestamp no es válido.
   */
  static timestamp(timestamp) {
    const timestampSchema = z
      .number({ message: "The timestamp must be a number" })
      .positive({ message: "The timestamp must be a positive number" })
      .int({ message: "The timestamp must be an integer" });
    timestampSchema.parse(timestamp);
  }

  /**
   * Valida un usuario.
   * @param {Object} options - Los datos del usuario a validar.
   * @param {string} options.id - El ID del usuario.
   * @param {number} options.identificationId - El ID de identificación del usuario.
   * @param {string} options.identificationNumber - El número de identificación del usuario.
   * @param {string} [options.image] - La imagen del usuario.
   * @param {number} options.createdAt - La fecha de creación del usuario.
   * @param {number} options.updatedAt - La fecha de actualización del usuario.
   * @throws {Error} - Si algún dato no es válido o ya existe.
   */
  static user({
    id,
    identificationId,
    identificationNumber,
    image,
    createdAt,
    updatedAt
  }) {
    // Validar el ID del usuario
    validations.id(id);
    const user = Users.findOne({ _id: id });
    if (user) throw new Error("The user already exists");

    // Validar el ID y número de identificación
    validations.identificationId(identificationId);
    validations.identificationNumber(identificationNumber);
    const identification = Users.findOne({
      identification_id: identificationId,
      identification_number: identificationNumber
    });
    if (identification) throw new Error("The identification already exists");

    // Validar la imagen
    validations.image(image);

    // Validar timestamps
    validations.timestamp(createdAt);
    validations.timestamp(updatedAt);
  }

  /**
   * Valida los nombres.
   * @param {string} names - El nombre a validar.
   * @throws {z.ZodError} - Si el nombre no es válido.
   */
  static names(names) {
    const namesSchema = z
      .string()
      .min(1, { message: "The names field cannot be empty" });
    namesSchema.parse(names);
  }

  /**
   * Valida los apellidos.
   * @param {string|undefined} surnames - El apellido a validar.
   * @throws {z.ZodError} - Si el apellido no es válido.
   */
  static surnames(surnames) {
    const surnamesSchema = z
      .string()
      .min(1, { message: "The surnames field cannot be empty" })
      .optional();
    surnamesSchema.parse(surnames);
  }

  /**
   * Valida un ID de género.
   * @param {number} genderId - El ID de género a validar.
   * @throws {z.ZodError|Error} - Si el ID no es válido o no existe.
   */
  static genderId(genderId) {
    const genderSchema = z
      .number()
      .int({ message: "The gender ID must be an integer" });
    genderSchema.parse(genderId);

    const gender = ListGender.findOne({ _id: genderId });
    if (!gender) throw new Error("Gender does not exist");
  }

  /**
   * Valida un cliente.
   * @param {Object} options - Los datos del cliente a validar.
   * @param {string} options.id - El ID del cliente.
   * @param {string} options.names - Los nombres del cliente.
   * @param {string} [options.surnames] - Los apellidos del cliente.
   * @param {number} options.genderId - El ID de género del cliente.
   * @throws {Error} - Si algún dato no es válido o el cliente ya existe.
   */
  static client({ id, names, surnames, genderId }) {
    // Validar el ID del cliente
    validations.id(id);
    const client = Clients.findOne({ _id: id });
    if (client) throw new Error("The client already exists");

    // Validar nombres y apellidos
    validations.names(names);
    validations.surnames(surnames);

    // Validar el ID de género
    validations.genderId(genderId);
  }

  static roleId(roleId) {
    const roleSchema = z
      .number()
      .int({ message: "The role ID must be an integer" });
    roleSchema.parse(roleId);

    const role = ListRole.findOne({ _id: roleId });
    if (!role) throw new Error("Role does not exist");
  }

  static password(password) {
    const passwordSchema = z
      .string()
      .min(8, { message: "The password must have at least 8 characters" })
      .max(64, { message: "The password must have at most 64 characters" })
      .regex(/[a-z]/, {
        message: "The password must contain at least one lowercase letter"
      })
      .regex(/[A-Z]/, {
        message: "The password must contain at least one uppercase letter"
      })
      .regex(/\d/, { message: "The password must contain at least one number" })
      .regex(/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/, {
        message:
          "The password must contain at least one special character from the set: !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
      });
    passwordSchema.parse(password);
  }

  static taxRegimeCode(taxRegimeCode) {
    const taxRegimeCodeSchema = z
      .string()
      .min(3, {
        message: "The tax regime code must be at least 3 characters long"
      })
      .optional();
    taxRegimeCodeSchema.parse(taxRegimeCode);
  }

  static economicActivityCode(economicActivityCode) {
    const economicActivityCodeSchema = z
      .string()
      .min(3, {
        message: "The economic activity code must be at least 3 characters long"
      })
      .optional();
    economicActivityCodeSchema.parse(economicActivityCode);
  }

  /**
   * @param {{
   *   id: string;
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
  static seller({
    id,
    names,
    surnames,
    genderId,
    roleId,
    password,
    taxRegimeCode,
    economicActivityCode
  }) {
    validations.id(id);
    const seller = Sellers.findOne({ _id: id });
    if (seller) throw new Error("The seller already exists");

    validations.names(names);
    validations.surnames(surnames);

    validations.genderId(genderId);
    validations.roleId(roleId);

    validations.password(password);

    validations.taxRegimeCode(taxRegimeCode);
    validations.economicActivityCode(economicActivityCode);
  }

  static businessName(businessName) {
    const businessNameSchema = z
      .string()
      .min(1, { message: "The business name cannot be empty" });
    businessNameSchema.parse(businessName);
  }

  /**
   * @param {{
   *   id: string;
   *   businessName: string;
   * }} options
   * @returns {string} id
   */
  static supplier({ id, businessName }) {
    validations.id(id);
    const supplier = Suppliers.findOne({ _id: id });
    if (supplier) throw new Error("The supplier already exists");

    validations.businessName(businessName);
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
  static update({
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
    const user = Users.findOne({ _id: id });

    if (identificationId) validations.identificationId(identificationId);
    else identificationId = user.identification_id;
    if (identificationNumber)
      validations.identificationNumber(identificationNumber);
    else identificationNumber = user.identification_number;
    const identification = Users.findOne({
      identification_id: identificationId,
      identification_number: identificationNumber
    });
    if (identification && identification._id !== id)
      throw new Error("The identification already exists");

    validations.image(image);

    if (createdAt) validations.timestamp(createdAt);
    if (updatedAt) validations.timestamp(updatedAt);

    if (names) validations.names(names);
    validations.surnames(surnames);

    if (genderId) validations.genderId(genderId);
    if (roleId) validations.roleId();

    if (password) validations.password(password);

    validations.taxRegimeCode(taxRegimeCode);
    validations.economicActivityCode(economicActivityCode);

    if (businessName) validations.businessName(businessName);
  }
}
