import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

console.log('🔍 Cargando configuración de Sequelize...');

const useSSL = process.env.DB_SSL === 'true';
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';

const caPath = path.resolve('certs/global-bundle.pem');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: useSSL
        ? {
            require: true,
            rejectUnauthorized,
            ...(rejectUnauthorized && {
              ca: fs.readFileSync(caPath).toString(),
            }),
          }
        : false,
    },
  },
);

console.log('✅ Sequelize inicializado correctamente.');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database Connected');

    console.log('🔍 Importando modelos...');
    await import('../models/index.js');
    console.log('✅ Modelos importados correctamente.');

    // No hacemos sync aquí, lo hace server.js
  } catch (error) {
    const errorCode = error.original?.code || error.parent?.code || error.name;
    const address =
      error.original?.address || process.env.DB_HOST || 'unknown-host';
    const port = error.original?.port || process.env.DB_PORT || 'unknown-port';

    console.error(
      `❌ DB_CONNECTION_FAILED [ErrorCode: #DB-503]: Unable to connect to PostgreSQL at ${address}:${port}. Reason: ${errorCode}`,
    );
    // ⚡ SIN process.exit(1). Node sigue vivo esperando peticiones.
  }
};

export { sequelize };
export default connectDB;

/*   await sequelize.sync({ alter: true }); 
'validar que no es necesario para quitarlo o no evitando que se borren datos' */

/*
// The connectDB function is an async function that connects to the database using MongoDB.
import mongoose from "mongoose";

const connectDB = async ()=>{

    mongoose.connection.on('connected', ()=>console.log("Database Connected"));

    await mongoose.connect(`${process.env.MONGODB_URI}`);
};

export default connectDB;
*/
