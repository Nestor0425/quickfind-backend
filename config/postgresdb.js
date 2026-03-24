import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

console.log('🔍 Cargando configuración de Sequelize...');

const useSSL = process.env.DB_SSL === 'true';
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';

const caPath = path.resolve('certs/global-bundle.pem');

// 🔥 NUEVO: detectar si existe DATABASE_URL
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (process.env.DATABASE_URL) {
  // ✅ MODO PRODUCCIÓN (Supabase / Render)
  console.log('🌐 Usando DATABASE_URL para conexión');

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Supabase necesita esto
      },
    },
  });
} else {
  // ✅ MODO LOCAL (tu lógica original intacta)
  console.log('💻 Usando configuración local DB_HOST');

  sequelize = new Sequelize(
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
}

console.log('✅ Sequelize inicializado correctamente.');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database Connected');

    console.log('🔍 Importando modelos...');
    await import('../models/index.js');
    console.log('✅ Modelos importados correctamente.');

  } catch (error) {
    const errorCode = error.original?.code || error.parent?.code || error.name;
    const address =
      error.original?.address || process.env.DB_HOST || 'unknown-host';
    const port = error.original?.port || process.env.DB_PORT || 'unknown-port';

    console.error(
      `❌ DB_CONNECTION_FAILED [ErrorCode: #DB-503]: Unable to connect to PostgreSQL at ${address}:${port}. Reason: ${errorCode}`,
    );
  }
};

export { sequelize };
export default connectDB;