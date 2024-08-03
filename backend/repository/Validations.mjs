import { z } from "zod";
import {
  Clients,
  EnumGender,
  EnumIdentification,
  EnumRole,
  Sellers,
  Suppliers,
  Users
} from "./database.mjs";

export class Validations {
  static id(id) {
    const idSchema = z
      .string()
      .uuid({ message: "The ID must have a valid UUID syntax" });
    idSchema.parse(id);
  }

  static identificationId(identificationId) {
    const identificationSchema = z
      .number()
      .int({ message: "The identification ID must be an integer" });
    identificationSchema.parse(identificationId);

    const identification = EnumIdentification.findOne({
      _id: identificationId
    });
    if (!identification) throw new Error("Identification does not exist");
  }

  static identificationNumber(identificationNumber) {
    const numberSchema = z.string().min(3, {
      message: "The identification number must be more than 3 characters"
    });
    numberSchema.parse(identificationNumber);
  }

  static image(image) {
    const imageSchema = z
      .string()
      .url({ message: "The image must have a valid URL syntax" })
      .optional();
    imageSchema.parse(image);
  }

  static timestamp(timestamp) {
    const timestampSchema = z
      .number({ message: "The timestamp must be a number" })
      .positive({ message: "The timestamp must be a positive number" })
      .int({ message: "The timestamp must be an integer" });
    timestampSchema.parse(timestamp);
  }

  /**
   * @param {{
   *   id: string;
   *   identificationId: number;
   *   identificationNumber: string;
   *   image?: string;
   *   createdAt: number;
   *   updatedAt: number;
   * }} options
   */
  static user({
    id,
    identificationId,
    identificationNumber,
    image,
    createdAt,
    updatedAt
  }) {
    Validations.id(id);
    const user = Users.findOne({ _id: id });
    if (user) throw new Error("The user already exists");

    Validations.identificationId(identificationId);
    Validations.identificationNumber(identificationNumber);
    const identification = Users.findOne({
      identification_id: identificationId,
      identification_number: identificationNumber
    });
    if (identification) throw new Error("The identification already exists");

    Validations.image(image);

    Validations.timestamp(createdAt);
    Validations.timestamp(updatedAt);
  }

  static names(names) {
    const namesSchema = z
      .string()
      .min(1, { message: "The names field cannot be empty" });
    namesSchema.parse(names);
  }

  static surnames(surnames) {
    const surnamesSchema = z
      .string()
      .min(1, { message: "The surnames field cannot be empty" })
      .optional();
    surnamesSchema.parse(surnames);
  }

  static genderId(genderId) {
    const genderSchema = z
      .number()
      .int({ message: "The gender ID must be an integer" });
    genderSchema.parse(genderId);

    const gender = EnumGender.findOne({ _id: genderId });
    if (!gender) throw new Error("Gender does not exist");
  }

  /**
   * @param {{
   *   id: string;
   *   names: string;
   *   surnames?: string;
   *   genderId: number;
   * }} options
   * @returns {string} id
   */
  static client({ id, names, surnames, genderId }) {
    Validations.id(id);
    const client = Clients.findOne({ _id: id });
    if (client) throw new Error("The client already exists");

    Validations.names(names);
    Validations.surnames(surnames);

    Validations.genderId(genderId);
  }

  static roleId(roleId) {
    const roleSchema = z
      .number()
      .int({ message: "The role ID must be an integer" });
    roleSchema.parse(roleId);

    const role = EnumRole.findOne({ _id: roleId });
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
      .regex(/[@$!%*?&]/, {
        message:
          "The password must contain at least one special character (@, $, !, %, *, ?, &)"
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
    Validations.id(id);
    const seller = Sellers.findOne({ _id: id });
    if (seller) throw new Error("The seller already exists");

    Validations.names(names);
    Validations.surnames(surnames);

    Validations.genderId(genderId);
    Validations.roleId(roleId);

    Validations.password(password);

    Validations.taxRegimeCode(taxRegimeCode);
    Validations.economicActivityCode(economicActivityCode);
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
    Validations.id(id);
    const supplier = Suppliers.findOne({ _id: id });
    if (supplier) throw new Error("The supplier already exists");

    Validations.businessName(businessName);
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

    if (identificationId) Validations.identificationId(identificationId);
    else identificationId = user.identification_id;
    if (identificationNumber)
      Validations.identificationNumber(identificationNumber);
    else identificationNumber = user.identification_number;
    const identification = Users.findOne({
      identification_id: identificationId,
      identification_number: identificationNumber
    });
    if (identification && identification._id !== id)
      throw new Error("The identification already exists");

    Validations.image(image);

    if (createdAt) Validations.timestamp(createdAt);
    if (updatedAt) Validations.timestamp(updatedAt);

    if (names) Validations.names(names);
    Validations.surnames(surnames);

    if (genderId) Validations.genderId(genderId);
    if (roleId) Validations.roleId();

    if (password) Validations.password(password);

    Validations.taxRegimeCode(taxRegimeCode);
    Validations.economicActivityCode(economicActivityCode);

    if (businessName) Validations.businessName(businessName);
  }
}
