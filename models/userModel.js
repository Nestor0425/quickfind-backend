import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresdb.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
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
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_account_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment:
      'Interruptor general para "bannear" o desactivar usuarios sin borrarlos',
  },
  auth_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verify_otp: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  verify_otp_expire_at: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  reset_otp: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  reset_otp_expire_at: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
}, {
  // --- ESTA ES LA CORRECCIÓN APLICADA ---
  tableName: 'Users', 
  timestamps: true,   
  freezeTableName: true,
  underscored: false // <--- Agregado: Fuerza a Sequelize a usar CamelCase (createdAt/updatedAt)
});

// ⚠️ CERO RELACIONES AQUÍ. Mantén este archivo limpio.

export default User;