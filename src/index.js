const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db'); 
const userRoutes = require('./routes/userRoutes'); 
const Role = require('./models/Role');
const logger = require('./config/logger');
const corsOptions = require('./config/corsOptions');


connectDB();

// Inicialización de roles si no existen
async function initialSetup() {
    try {
        const roles = await Role.find();
        if (roles.length === 0) {
            await new Role({ name: 'usuario' }).save();
            await new Role({ name: 'administrador' }).save();
            logger.info('Roles de usuario inicializados');
        }
    } catch (error) {
        logger.error('Error al inicializar roles: ' + error.message);
    }
}
initialSetup();

app.use(cors(corsOptions));
app.use(express.json()); // Para que entienda los datos que le enviamos en formato de JSON

// Uso de rutas
app.use('/api', userRoutes); 

app.listen(3000, () => {
    logger.info('Servidor en el puerto 3000');
});
