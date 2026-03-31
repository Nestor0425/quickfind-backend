import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresdb.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT, // int8 en Supabase
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  area_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 9,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  birth_date: {
    // AJUSTE SENIOR: Usamos DATEONLY para que coincida con el tipo 'date' de tu captura
    type: DataTypes.DATEONLY, 
    allowNull: false,
  },
  is_account_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Interruptor general para banear o desactivar usuarios sin borrarlos',
  },
  // --- COLUMNAS QUE ACABAS DE CREAR EN SUPABASE ---
  auth_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verify_otp: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  verify_otp_expire_at: {
    type: DataTypes.BIGINT, // int8 en Supabase
    defaultValue: 0,
  },
  reset_otp: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  reset_otp_expire_at: {
    type: DataTypes.BIGINT, // int8 en Supabase
    defaultValue: 0,
  },
}, {
  tableName: 'Users', // Coincide con la "U" mayúscula de tu tabla
  freezeTableName: true,
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  underscored: false
});

export default User;