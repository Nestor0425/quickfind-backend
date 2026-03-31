import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresdb.js';

const Role = sequelize.define('Role', {
  rol_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  // --- CONFIGURACIÓN PARA SINCRONIZAR CON SUPABASE ---
  tableName: 'roles',     // Forzamos minúsculas: en tu Supabase dice 'roles'
  freezeTableName: true,  // Evita que Sequelize intente pluralizar a 'Roles'
  timestamps: false       // En tu captura de 'roles' no existen createdAt/updatedAt
});

export default Role;