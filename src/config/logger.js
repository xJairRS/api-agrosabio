const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, printf, colorize, errors } = format;
const myFormat = printf(({ level, message, timestamp, stack }) => {
  // Usamos stack para los errores, si está disponible si no usamos message
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
  format: combine(
    errors({ stack: true }), // Muestra el stack de errores
    colorize(), // Aplica colores según el nivel del log
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    myFormat // Usa el formato personalizado
  ),
  transports: [
    new transports.Console({
      level: 'debug', // Muestra todos los niveles de logs en la consola
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'logs/warn.log',
      level: 'warn',
    }),
    new transports.File({
      filename: 'logs/info.log',
      level: 'info',
    }),
  ],
});

module.exports = logger;
