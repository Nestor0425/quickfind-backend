import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = winston.format;

// Define el formato del log
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Configura la rotación mensual de logs con límite de tamaño
const transport = new DailyRotateFile({
    filename: 'logs/system-%DATE%.log',  // Archivo mensual: system-YYYY-MM.log
    datePattern: 'YYYY-MM',  // Rotación cada mes
    zippedArchive: true,  // Comprime archivos antiguos
    maxSize: '10m',  // Máximo 10 MB por archivo antes de crear un nuevo fragmento
    maxFiles: '3',  // Mantiene solo los últimos 3 meses de logs
});

// Crea el logger
const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        transport,
        new winston.transports.Console()  // También se muestran logs en consola
    ]
});

export default logger;