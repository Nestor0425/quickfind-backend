import { DataTypes } from 'sequelize';
import { sequelize } from '../config/postgresdb.js';
import Role from './role.js';
import NivelFidelizacion from './nivelFidelizacion.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    birth_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Garantiza que los correos sean únicos
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_lada: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^\+(\d{1,4})$/,
        },
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^\d{10}$/,
        },
    },
    verify_otp: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    verify_otp_expire_at: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
    is_account_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    reset_otp: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    reset_otp_expire_at: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
    },
    auth_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1  // Valor por defecto
    },
    nivel_fidelizacion_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
});

// Relaciones
User.belongsTo(Role, { foreignKey: 'rol_id'});
User.belongsTo(NivelFidelizacion, { foreignKey: 'nivel_fidelizacion_id'});

export default User;

/*
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true}, // Nombre
    surname: { type: String, required: true }, // Apellido
    country: { type: String, required: true }, // País o región
    birthDate: { type: Date, required: true }, // Fecha de nacimiento
    email: { type: String, required: true, unique: true}, // Correo
    password: { type: String, required: true}, // Contraseña
    phoneLada: { 
        type: String,  
        required: true, 
        match: [/^\+(\d{1,4})$/, 'La lada debe tener entre 1 y 4 dígitos (por ejemplo, +52, +1)'] 
    }, // Validación para lada de 1 a 4 dígitos
    phoneNumber: { 
        type: String, 
        required: true, 
        match: [/^\d{10}$/, 'El número de teléfono debe contener 10 dígitos'] 
    }, // Teléfono móvil, con validación para 10 dígitos
    roles: { 
        type: [String], 
        enum: ['user', 'admin', 'moderator'], 
        default: ['user'] 
    },
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpireAt: {type: Number, default: 0},
})

const userModel = mongoose.models.user || mongoose.model('users', userSchema);

export default userModel;
*/