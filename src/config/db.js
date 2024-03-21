const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost/api-agrosabio');
        logger.info('Conectado a la base de datos');
    } catch (err) {
        logger.error('Error de conexión a la base de datos: ' + err.message);
        //process.exit(1); // Detiene la aplicación si no puede conectarse a la base de datos
    }
};

module.exports = connectDB;
