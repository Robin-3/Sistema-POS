import DBLocal from 'db-local';

const { Schema } = new DBLocal({ path: './db' });

export const Users = Schema('users', {
  _id: { type: String, required: true },
  identification_id: { type: Number, required: true },
  identification_number: { type: String, required: true },
  image: { type: String },
  created_at: { type: Number, required: true },
  updated_at: { type: Number, required: true }
});

export const Sellers = Schema('sellers', {
  _id: { type: String, required: true },
  names: { type: String, required: true },
  surnames: { type: String },
  gender_id: { type: Number, required: true },
  role_id: { type: Number, required: true },
  password: { type: String, required: true },
  tax_regime_code: { type: String },
  economic_activity_code: { type: String }
});
