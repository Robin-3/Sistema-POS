import { dbRepository } from "./dbRepository.mjs";

export class listRepository {
  /**
   * Elimina todos los registros de las tablas de listas.
   */
  static removeAll() {
    const tableLists = [
      "list_contact",
      "list_gender",
      "list_identification",
      "list_permission",
      "list_role"
    ];
    tableLists.forEach((tableName) => dbRepository.clearTable({ tableName }));
  }

  /**
   * Obtiene el listado de datos de identificación.
   * @returns {{
   *   id: number;
   *   code: string;
   * }[]} - Lista de identificaciones.
   */
  static identifications() {
    return dbRepository
      .getTableData({ tableName: "list_identification" })
      .map(({ _id, code }) => ({ id: _id, code }));
  }

  /**
   * Inserta datos iniciales en las tablas de listas.
   */
  static initializeDefaultData() {
    dbRepository.insertRows({
      tableName: "list_contact",
      values: [
        { contact: "Teléfono" },
        { contact: "Dirección" },
        { contact: "Correo electrónico" }
      ]
    });

    dbRepository.insertRows({
      tableName: "list_gender",
      values: [
        { gender: "Masculino" },
        { gender: "Femenino" },
        { gender: "Otro" }
      ]
    });

    dbRepository.insertRows({
      tableName: "list_identification",
      values: [
        { code: "NIT", identification: "Número de Identificación Tributaria" },
        { code: "CC", identification: "Cédula de Ciudadania" },
        { code: "TI", identification: "Tarjeta de Identidad" },
        { code: "CE", identification: "Cédula de Extranjería" }
      ]
    });

    dbRepository.insertRows({
      tableName: "list_permission",
      values: [
        { permission: "Gestión de ventas" },
        { permission: "Gestión de productos" },
        { permission: "Gestión de clientes" },
        { permission: "Gestión de proveedores" },
        { permission: "Gestión de compras" },
        { permission: "Gestión de cajas" },
        { permission: "Gestión de gastos" },
        { permission: "Ver reportes" },
        { permission: "Configuración del sistema" }
      ]
    });

    dbRepository.insertRows({
      tableName: "list_role",
      values: [
        { role: "Negocio" },
        { role: "Administrador" },
        { role: "Cajero" }
      ]
    });
  }
}
