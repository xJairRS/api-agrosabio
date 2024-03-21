/*const {Router} = require('express');
const User = require('../models/User');
const Role = require('../models/Role');
const router = Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

//registrar usuario
//router.post('/signup', conotroller.signup){}
router.post('/signup', async (req, res) => {
  const { name, lastname, email, password, roleName } = req.body;

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).send('El usuario ya existe con ese correo electrónico.');
      }

      const role = await Role.findOne({ name: roleName }); // Encuentra el rol por el nombre
      if (!role) {
          return res.status(400).send('Rol no válido.');
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = new User({ name, lastname, email, password: hashedPassword, role: role._id });
      await newUser.save();

      const token = jwt.sign({ _id: newUser._id, role: role.name }, 'secretkey'); // Opcional: incluir información del rol en el token
      res.status(201).json({ token });
    } catch (error) {
      console.error(error); // Esto te mostrará el error específico en la consola
      res.status(500).json({ error: 'Error al registrar el usuario', details: error.message }); // Agregar 'details' puede ayudarte a diagnosticar
  }
});


//iniciar sesión
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).send("El correo no existe");
      }

      // Comparar la contraseña enviada con la contraseña hasheada almacenada
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).send("Contraseña incorrecta");
      }

      const token = jwt.sign({ _id: user._id }, 'secretkey');
      res.cookie('token', token, { httpOnly: true });
      return res.status(200).json({ token });
  } catch (error) {
      res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

//destruccion del token
router.post('/signout', (req, res) => {
  res.clearCookie('token').json({message: 'Sesión cerrada correctamente'});
});


//ruta para validar el correo
router.post('/checkEmail', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json({ message: 'El correo existe' });
    } else {
      res.status(404).json({ message: 'El correo no existe' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el correo' });
  }
});

//actualizar la contraseña si se perdio
router.post('/updatePassword', async (req, res) => {
  const { email, newPassword } = req.body; // Asumiendo que el cuerpo de la solicitud contiene el correo electrónico y la nueva contraseña

  try {
    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ email });

    // Si no se encuentra el usuario, enviar un mensaje de error
    if (!user) {
      return res.status(404).send('Usuario no encontrado con ese correo electrónico.');
    }

    // Si se encuentra el usuario, actualizar su contraseña
    // Aquí deberías hashear la contraseña antes de guardarla, por ejemplo, usando bcrypt
    const saltRounds = 10; // Número de rondas de sal para el hashing

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword; // Actualizar la contraseña hasheada del usuario
    await user.save(); // Guardar el usuario actualizado en la base de datos

    // Enviar una respuesta exitosa
    res.status(200).send('Contraseña actualizada correctamente.');
  } catch (error) {
    // Manejar cualquier otro error
    res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
});



router.get('/profile', verifyToken, (req, res) => {
    res.send(req.userId);
}); 


function verifyToken(res, req, next){ // verificar el token en la cabecera de la petición de tasks privadas
    if (!req.headers.authorization){
        return res.status(401).send('Autorización negada');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token === 'null'){
        return res.status(401).send('Autorización negada');
    }

    const payload = jwt.verify(token, 'secretkey');
    req.userId = payload._id;
    next();

}
// Obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
      // Buscar todos los usuarios en la colección
      const users = await User.find();
      // Enviar la respuesta con los usuarios encontrados
      res.json(users);
    } catch (error) {
      // Manejar los posibles errores
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  });

// Crear un usuario
router.post('/user', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});
module.exports = router;




*/