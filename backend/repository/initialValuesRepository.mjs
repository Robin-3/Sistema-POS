import {
  EnumContact,
  EnumGender,
  EnumIdentification,
  EnumPermission,
  EnumRole,
  Sequence
} from './database.mjs';

export class initialValuesRepository {
  static initValues() {
    EnumContact.create({
      _id: 1,
      contact: 'Teléfono'
    }).save();
    EnumContact.create({
      _id: 2,
      contact: 'Dirección'
    }).save();
    EnumContact.create({
      _id: 3,
      contact: 'Correo electrónico'
    }).save();

    EnumGender.create({
      _id: 1,
      gender: 'Masculino'
    }).save();
    EnumGender.create({
      _id: 2,
      gender: 'Femenino'
    }).save();
    EnumGender.create({
      _id: 3,
      gender: 'Otro'
    }).save();

    EnumIdentification.create({
      _id: 1,
      code: 'NIT',
      identification: 'Número de Identificación Tributaria'
    }).save();
    EnumIdentification.create({
      _id: 2,
      code: 'CC',
      identification: 'Cédula de Ciudadania'
    }).save();
    EnumIdentification.create({
      _id: 3,
      code: 'TI',
      identification: 'Tarjeta de Identidad'
    }).save();
    EnumIdentification.create({
      _id: 4,
      code: 'CE',
      identification: 'Cédula de Extranjería'
    }).save();

    EnumPermission.create({
      _id: 1,
      permission: 'Gestión de ventas'
    }).save();
    EnumPermission.create({
      _id: 2,
      permission: 'Gestión de productos'
    }).save();
    EnumPermission.create({
      _id: 3,
      permission: 'Gestión de clientes'
    }).save();
    EnumPermission.create({
      _id: 4,
      permission: 'Gestión de proveedores'
    }).save();
    EnumPermission.create({
      _id: 5,
      permission: 'Gestión de compras'
    }).save();
    EnumPermission.create({
      _id: 6,
      permission: 'Gestión de cajas'
    }).save();
    EnumPermission.create({
      _id: 7,
      permission: 'Gestión de gastos'
    }).save();
    EnumPermission.create({
      _id: 8,
      permission: 'Ver reportes'
    }).save();
    EnumPermission.create({
      _id: 9,
      permission: 'Configuración del sistema'
    }).save();

    EnumRole.create({
      _id: 1,
      role: 'Negocio'
    }).save();
    EnumRole.create({
      _id: 2,
      role: 'Administrador'
    }).save();
    EnumRole.create({
      _id: 3,
      role: 'Cajero'
    }).save();

    Sequence.create({
      _id: 1,
      table: 'sequence',
      sequence: 7
    }).save();
    Sequence.create({
      _id: 2,
      table: 'enum_contact',
      sequence: 4
    }).save();
    Sequence.create({
      _id: 3,
      table: 'enum_gender',
      sequence: 4
    }).save();
    Sequence.create({
      _id: 4,
      table: 'enum_identification',
      sequence: 5
    }).save();
    Sequence.create({
      _id: 5,
      table: 'enum_permission',
      sequence: 10
    }).save();
    Sequence.create({
      _id: 6,
      table: 'enum_role',
      sequence: 4
    }).save();
  }

  // todo
  static clearDB() {}
}
