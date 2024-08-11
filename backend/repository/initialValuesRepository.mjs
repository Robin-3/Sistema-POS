import {
  ListContact,
  ListGender,
  ListIdentification,
  ListPermission,
  ListRole,
  Sequence
} from "./database.mjs";

export class initialValuesRepository {
  static initValues() {
    ListContact.create({
      _id: 1,
      contact: "Teléfono"
    }).save();
    ListContact.create({
      _id: 2,
      contact: "Dirección"
    }).save();
    ListContact.create({
      _id: 3,
      contact: "Correo electrónico"
    }).save();

    ListGender.create({
      _id: 1,
      gender: "Masculino"
    }).save();
    ListGender.create({
      _id: 2,
      gender: "Femenino"
    }).save();
    ListGender.create({
      _id: 3,
      gender: "Otro"
    }).save();

    ListIdentification.create({
      _id: 1,
      code: "NIT",
      identification: "Número de Identificación Tributaria"
    }).save();
    ListIdentification.create({
      _id: 2,
      code: "CC",
      identification: "Cédula de Ciudadania"
    }).save();
    ListIdentification.create({
      _id: 3,
      code: "TI",
      identification: "Tarjeta de Identidad"
    }).save();
    ListIdentification.create({
      _id: 4,
      code: "CE",
      identification: "Cédula de Extranjería"
    }).save();

    ListPermission.create({
      _id: 1,
      permission: "Gestión de ventas"
    }).save();
    ListPermission.create({
      _id: 2,
      permission: "Gestión de productos"
    }).save();
    ListPermission.create({
      _id: 3,
      permission: "Gestión de clientes"
    }).save();
    ListPermission.create({
      _id: 4,
      permission: "Gestión de proveedores"
    }).save();
    ListPermission.create({
      _id: 5,
      permission: "Gestión de compras"
    }).save();
    ListPermission.create({
      _id: 6,
      permission: "Gestión de cajas"
    }).save();
    ListPermission.create({
      _id: 7,
      permission: "Gestión de gastos"
    }).save();
    ListPermission.create({
      _id: 8,
      permission: "Ver reportes"
    }).save();
    ListPermission.create({
      _id: 9,
      permission: "Configuración del sistema"
    }).save();

    ListRole.create({
      _id: 1,
      role: "Negocio"
    }).save();
    ListRole.create({
      _id: 2,
      role: "Administrador"
    }).save();
    ListRole.create({
      _id: 3,
      role: "Cajero"
    }).save();

    Sequence.create({
      _id: 1,
      table: "sequence",
      sequence: 7
    }).save();
    Sequence.create({
      _id: 2,
      table: "list_contact",
      sequence: 4
    }).save();
    Sequence.create({
      _id: 3,
      table: "list_gender",
      sequence: 4
    }).save();
    Sequence.create({
      _id: 4,
      table: "list_identification",
      sequence: 5
    }).save();
    Sequence.create({
      _id: 5,
      table: "list_permission",
      sequence: 10
    }).save();
    Sequence.create({
      _id: 6,
      table: "list_role",
      sequence: 4
    }).save();
  }

  // todo
  static clearDB() {}
}
