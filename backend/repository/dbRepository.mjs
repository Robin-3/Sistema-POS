import {
  Clients,
  ContactsUsers,
  ListContact,
  ListGender,
  ListIdentification,
  ListPermission,
  ListRole,
  SellerHierarchy,
  Sellers,
  Sequence,
  Suppliers,
  Users
} from "./database.mjs";

/**
 * @typedef {"list_contact" | "list_gender" | "list_identification" | "list_permission" | "list_role"} ListsTableName
 * @typedef {"users" | "clients" | "sellers" | "suppliers"} UsersTableName
 * @typedef {"contacts_users" | "seller_hierarchy"} RelationshipsTableName
 * @typedef {ListsTableName | UsersTableName | RelationshipsTableName} TableName
 */

const tables = {
  list_contact: ListContact,
  list_gender: ListGender,
  list_identification: ListIdentification,
  list_permission: ListPermission,
  list_role: ListRole,
  users: Users,
  clients: Clients,
  sellers: Sellers,
  suppliers: Suppliers,
  contacts_users: ContactsUsers,
  seller_hierarchy: SellerHierarchy
};

export class dbRepository {
  /**
   * Obtiene una tabla específica por su nombre.
   * @param {Object} options
   * @param {TableName} options.tableName - El nombre de la tabla.
   * @returns {Object[]} - La tabla solicitada.
   * @throws {Error} - Si la tabla no existe.
   */
  static getTable({ tableName }) {
    const table = tables[tableName];
    if (!table) throw new Error(`Table "${tableName}" does not exist`);
    return table;
  }

  /**
   * Obtiene todos los datos de una tabla específica.
   * @param {Object} options
   * @param {TableName} options.tableName - El nombre de la tabla.
   * @returns {Object[]} - Los datos de la tabla.
   * @throws {Error} - Si la tabla no existe.
   */
  static getTableData({ tableName }) {
    const table = dbRepository.getTable({ tableName });
    return table.find();
  }

  /**
   * Obtiene todos los datos de una tabla específica bajo un filtro.
   * @param {Object} options
   * @param {TableName} options.tableName - El nombre de la tabla.
   * @param {Object} options.filter - El filtro de búsqueda aplicado a los datos.
   * @returns {Object[]} - Los datos filtrados de la tabla.
   * @throws {Error} - Si la tabla no existe.
   */
  static findTableData({ tableName, filter }) {
    const table = dbRepository.getTable({ tableName });
    return table.find({ ...filter });
  }

  /**
   * Obtiene el primer dato de una tabla específica bajo un filtro.
   * @param {Object} options
   * @param {TableName} options.tableName - El nombre de la tabla.
   * @param {Object} options.filter - El filtro de búsqueda aplicado a los datos.
   * @returns {Object | undefined} - El primer dato que coincide con el filtro, o undefined si no se encuentra ningún dato.
   * @throws {Error} - Si la tabla no existe.
   */
  static findOneTableData({ tableName, filter }) {
    const table = dbRepository.getTable({ tableName });
    return table.findOne({ ...filter });
  }

  /**
   * Limpia una tabla específica, eliminando todos sus registros.
   * @param {Object} options
   * @param {TableName} options.tableName - El nombre de la tabla.
   * @throws {Error} - Si la tabla no existe.
   */
  static clearTable({ tableName }) {
    const rows = dbRepository.getTableData({ tableName });
    for (const row of rows) {
      row.remove();
    }
  }

  /**
   * Inserta una fila en una tabla específica.
   * @param {Object} options
   * @param {TableName} options.tableName - El nombre de la tabla.
   * @param {Object} options.value - El valor a insertar.
   * @throws {Error} - Si la tabla no existe.
   */
  static insertRow({ tableName, value }) {
    const table = dbRepository.getTable({ tableName });
    let sequence = Sequence.findOne({ table: tableName });
    if (!sequence) {
      Sequence.create({ table: tableName, sequence: 0 }).save();
      sequence = Sequence.findOne({ table: tableName });
    }
    let id = value._id || value.id;
    if (!id) {
      id = sequence.sequence + 1;
      sequence.sequence = id;
      sequence.save();
    }
    table.create({ ...value, _id: id }).save();
  }

  /**
   * Inserta múltiples filas en una tabla específica.
   * @param {Object} options
   * @param {TableName} options.tableName - El nombre de la tabla.
   * @param {Object[]} options.values - Los valores a insertar.
   * @throws {Error} - Si la tabla no existe.
   */
  static insertRows({ tableName, values }) {
    const table = dbRepository.getTable({ tableName });
    let sequence = Sequence.findOne({ table: tableName });
    if (!sequence) {
      Sequence.create({ table: tableName, sequence: 0 }).save();
      sequence = Sequence.findOne({ table: tableName });
    }
    let idSeq = sequence.sequence;
    for (const value of values) {
      let id = value._id || value.id;
      if (!id) {
        id = ++idSeq;
      }
      table.create({ ...value, _id: id }).save();
    }
    if (sequence.sequence !== idSeq) {
      sequence.sequence = idSeq;
      sequence.save();
    }
  }

  /**
   * Actualiza los datos de una fila en una tabla específica.
   * @param {Object} options
   * @param {TableName} options.tableName - El nombre de la tabla.
   * @param {Object} options.filter - El filtro de búsqueda aplicado a los datos.
   * @param {Object} options.value - El valor a actualizar.
   * @throws {Error} - Si la tabla no existe.
   */
  static updateRow({ tableName, filter, value }) {
    const table = dbRepository.findOneTableData({ tableName, filter });
    table.update({ ...value }).save();
  }

  /**
   * Elimina una fila en una tabla específica.
   * @param {Object} options
   * @param {TableName} options.tableName - El nombre de la tabla.
   * @param {Object} options.filter - El filtro de búsqueda aplicado a los datos.
   * @throws {Error} - Si la tabla no existe.
   */
  static removeRow({ tableName, filter }) {
    const table = dbRepository.findOneTableData({ tableName, filter });
    table.remove();
  }

  /**
   * Elimina varias en una tabla específica.
   * @param {Object} options
   * @param {TableName} options.tableName - El nombre de la tabla.
   * @param {Array} options.ids - El listado de ids a eliminar.
   * @throws {Error} - Si la tabla no existe.
   */
  static removeRowsByIds({ tableName, ids }) {
    for (const id of ids) {
      dbRepository.removeRow({ tableName, filter: { _id: id } });
    }
  }
}
