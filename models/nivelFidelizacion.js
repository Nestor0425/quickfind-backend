import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresdb.js';

const NivelFidelizacion = sequelize.define('NivelFidelizacion', {
    nivel_fidelizacion_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nivel: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
});

export default NivelFidelizacion;