import DBLocal from "db-local";

const { Schema } = new DBLocal({ path: "./db" });

/// -- ENUMS -- ///
export const EnumContact = Schema("enum_contact", {
  _id: { type: Number, required: true },
  contact: { type: String, required: true }
});

export const EnumGender = Schema("enum_gender", {
  _id: { type: Number, required: true },
  gender: { type: String, required: true }
});

export const EnumIdentification = Schema("enum_identification", {
  _id: { type: Number, required: true },
  code: { type: String, required: true },
  identification: { type: String, required: true }
});

export const EnumPermission = Schema("enum_permission", {
  _id: { type: Number, required: true },
  permission: { type: String, required: true }
});

export const EnumRole = Schema("enum_role", {
  _id: { type: Number, required: true },
  role: { type: String, required: true }
});

/// -- TABLAS -- ///
// -- Usuarios
export const Users = Schema("users", {
  _id: { type: String, required: true },
  identification_id: { type: Number, required: true },
  identification_number: { type: String, required: true },
  image: { type: String },
  created_at: { type: Number, required: true },
  updated_at: { type: Number, required: true }
});

export const Clients = Schema("clients", {
  _id: { type: String, required: true },
  names: { type: String, required: true },
  surnames: { type: String },
  gender_id: { type: Number, required: true }
});

export const Sellers = Schema("sellers", {
  _id: { type: String, required: true },
  names: { type: String, required: true },
  surnames: { type: String },
  gender_id: { type: Number, required: true },
  role_id: { type: Number, required: true },
  password: { type: String, required: true },
  tax_regime_code: { type: String },
  economic_activity_code: { type: String }
});

export const Suppliers = Schema("suppliers", {
  _id: { type: String, required: true },
  business_name: { type: String, required: true }
});

/// -- TABLAS M*M -- ///
export const ContactsUsers = Schema("contacts_users", {
  _id: { type: Number, required: true },
  contact_id: { type: String, required: true },
  user_id: { type: Number, required: true },
  contact: { type: String, required: true }
});

export const PermissionsRoles = Schema("permissions_roles", {
  _id: { type: Number, required: true },
  permission_id: { type: Number, required: true },
  role_id: { type: Number, required: true }
});

export const SellerHierarchy = Schema("seller_hierarchy", {
  _id: { type: Number, required: true },
  seller_id: { type: String, required: true },
  top_seller_id: { type: String, required: true }
});

// -- SISTEMA (SQLite) -- //
export const Sequence = Schema("sequence", {
  _id: { type: Number, required: true },
  table: { type: String, required: true },
  sequence: { type: Number, required: true }
});
