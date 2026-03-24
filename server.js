import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

// Importaciones de los módulos path
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import connectDB, { sequelize } from './config/postgresdb.js';

// Routes
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import roleRouter from './routes/roleRoutes.js';
import levelAreaRouter from './routes/levelAreaRoutes.js';

import logger from './logger.js';

// =======================================================================
// 🚩 1. CONFIGURACIÓN DE RUTAS ABSOLUTAS (__dirname en ES Modules)
// =======================================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// =======================================================================
// 🚩 2. TRUST PROXY
// =======================================================================

app.set('trust proxy', 1);

// =======================================================================
// 🚩 3. SEGURIDAD
// =======================================================================

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
);

// =======================================================================
// 🚩 4. PARSEO
// =======================================================================

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// =======================================================================
// 🚩 5. CORS
// =======================================================================

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(`❌ CORS bloqueado para: ${origin}`);
      return callback(new Error('Bloqueado por CORS'));
    },

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-forwarded-for'],
  }),
);

// =======================================================================
// 🚩 6. RATE LIMIT
// =======================================================================

const getClientIP = (req) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  if (ip && ip.includes(',')) ip = ip.split(',')[0];

  return ip?.replace(/^::ffff:/, '');
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    const ip = getClientIP(req);

    logger.warn(`⚠️ IP bloqueada temporalmente por exceso de requests: ${ip}`);

    res.status(429).json({
      success: false,
      message:
        'Demasiadas solicitudes al servidor. Intente nuevamente en unos minutos.',
    });
  },
});

app.use(limiter);

// =======================================================================
// 🚩 7. ARCHIVOS ESTÁTICOS
// =======================================================================

app.use('/assets', express.static(path.join(__dirname, 'assets')));

// =======================================================================
// 🚩 8. RUTAS
// =======================================================================

app.get('/', (req, res) => {
  res.send('API Working fine');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/roles', roleRouter);
app.use('/api/levelArea', levelAreaRouter);

// =======================================================================
// 🚩 9. ERROR JSON
// =======================================================================

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.log('❌ Invalid JSON format');

    return res.status(400).json({
      success: false,
      message: 'Formato JSON inválido',
    });
  }

  next();
});

// =======================================================================
// 🚩 10. 404
// =======================================================================

app.use((req, res) => {
  res.status(404).json({
    message: `No se encontró la ruta: ${req.method} ${req.originalUrl}`,
  });
});

// =======================================================================
// 🚩 11. START SERVER
// =======================================================================

const startServer = async () => {
  try {
    console.log('🔍 Conectando a la base de datos...');

    await connectDB();

    console.log('✅ Base de datos conectada');

    // 🔥 SOLO EN DESARROLLO
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
      console.log('✅ Modelos sincronizados (dev)');
    } else {
      console.log('🚀 Producción: sync desactivado');
    }

    app.listen(port, () => {
      logger.info(`🚀 Server started on PORT:${port}`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);

    process.exit(1);
  }
};

startServer();