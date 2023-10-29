const jwt = require('jsonwebtoken');
const secretKey = 'test_1'; // Reemplaza con tu clave secreta


// Lista de tokens revocados
const revokedTokens = new Set();

function authenticate(req, res, next) {
  const token = req.header('Authorization');

  console.log('Token recibido:', token); // Agrega un registro de consola para verificar el token recibido

  if (!token) {
    console.log('Token de autenticación no proporcionado'); // Agrega un registro de consola en caso de token faltante
    return res.status(401).json({ message: 'Token de autenticación no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey);

    // Verificar si el token está en la lista de tokens revocados
    if (revokedTokens.has(decoded.tokenId)) {
      console.log('El usuario cerró sesión'); // Usuario cerró sesión
      return res.status(401).json({ message: 'El usuario cerró sesión' });
    }

    req.user = decoded; // Almacena la información del usuario en la solicitud

    console.log('Usuario autenticado:', req.user); // Agrega un registro de consola para verificar el usuario autenticado

    next();
  } catch (error) {
    console.log('Token de autenticación inválido:', error); // Agrega un registro de consola en caso de token inválido
    return res.status(401).json({ message: 'Token de autenticación inválido' });
  }
}

module.exports = authenticate;
