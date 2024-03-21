const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const logger = require('../config/logger'); 
const saltRounds = 10;

exports.signup = async (req, res) => {
    const { email, password, roleName } = req.body; 

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn(`Intento de registro con correo existente`);
            return res.status(400).send('El usuario ya existe con ese correo electrónico.');
        }

        const role = await Role.findOne({ name: roleName });
        if (!role) {
            logger.warn(`Intento de registro con rol no válido`);
            return res.status(400).send('Rol no válido.');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ email, password: hashedPassword, role: role._id }); // Se quitan el nombre y apellido
        await newUser.save();

        logger.info(`Nuevo usuario registrado`);
        const token = jwt.sign({ _id: newUser._id, role: role.name }, 'secretkey');
        res.status(201).json({ token });
    } catch (error) {
        logger.error(`Error al registrar usuario`);
        res.status(500).json({ error: 'Error al registrar el usuario', details: error.message });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('role');
        if (!user) {
            logger.warn(`Intento de inicio de sesión con correo no existente`);
            return res.status(401).send("El correo no existe");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Intento de inicio de sesión con contraseña incorrecta`);
            return res.status(401).send("Contraseña incorrecta");
        }

        const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: '1h' });

        logger.info(`Inicio de sesión exitoso`);
        res.status(200).json({ token: token, role: user.role.name });
    } catch (error) {
        logger.error(`Error al iniciar sesión`);
        res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
    }
};

exports.signout = (req, res) => {
    logger.info(`Sesión cerrada correctamente`);
    res.clearCookie('token').json({message: 'Sesión cerrada correctamente'});
};

exports.checkEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            logger.info(`Verificación de correo existente`);
            res.status(200).json({ message: 'El correo existe' });
        } else {
            logger.info(`Verificación de correo no existente`);
            res.status(404).json({ message: 'El correo no existe' });
        }
    } catch (error) {
        logger.error(`Error al buscar el correo`);
        res.status(500).json({ error: 'Error al buscar el correo', details: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Intento de actualizar contraseña para correo no encontrado`);
            return res.status(404).send('Usuario no encontrado con ese correo electrónico.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        await user.save();

        logger.info(`Contraseña actualizada correctamente`);
        res.status(200).send('Contraseña actualizada correctamente.');
    } catch (error) {
        logger.error(`Error al actualizar la contraseña`);
        res.status(500).json({ error: 'Error al actualizar la contraseña', details: error.message });
    }
};



exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role'); // Encuentra todos los usuarios
        res.json(users); // Envía la lista 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUser = async (req, res) => { 
try {
    const user = await User.findById(req.params.id); // Encuentra el usuario por su id
    if(!user){
        return res.status(404).json({message: "Usuario no encontrado"});
    }
    res.json(user); // Envía el usuario como respuesta
} catch (error) {
    res.status(500).json({ message: error.message });
}

};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        res.json(updatedUser); // Enviar el usuario actualizado como respuesta
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "ID de usuario no válido" });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        return res.status(200).json({message: "Usuario eliminado"});
    } catch (error) {
        res.status(500).json({ message: error.message });  
    }
};