const jwt = require('jsonwebtoken');
const logger = require('../config/logger'); 

// Middleware para verificar el token
exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        try {
            const verified = jwt.verify(req.token, 'secretkey');
            req.user = verified;
            logger.info(`Token verificado con éxito para el usuario: ${req.user._id}`);
            next();
        } catch (error) {
            logger.warn(`Token no válido o expirado: ${error.message}`);
            res.status(403).json({ error: "Token no válido o expirado" });
        }
    } else {
        logger.warn("Intento de acceso sin token");
        res.status(403).send("Se requiere un token para acceder a este recurso");
    }
};

// Middleware para roles
exports.verifyRole = roles => (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
        logger.info(`Acceso autorizado para el usuario: ${req.user._id} con rol: ${req.user.role}`);
        next();
    } else {
        logger.warn(`Acceso denegado para el usuario: ${req.user ? req.user._id : "Desconocido"} con rol: ${req.user ? req.user.role : "Desconocido"}`);
        res.status(403).json({ error: "No tienes permiso para realizar esta acción" });
    }
};
