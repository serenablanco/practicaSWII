const express = require('express');
const session = require('express-session');
const router = express.Router();
const dbo = require('../db/conn');

// Configurar el middleware de gestión de sesiones
router.use(session({
    secret: 'tu_secreto', // Cambia esto por una cadena segura
    resave: false,
    saveUninitialized: true
}));

// Ruta de la página de inicio de sesión (página principal)
router.get('/', (req, res) => {
    res.render('login');
});

// Ruta para manejar el inicio de sesión
router.post('/', async (req, res) => {
    const { username } = req.body;

    // Guardar el nombre de usuario en la sesión
    req.session.username = username;

    // Redirigir a la página de inicio o a donde quieras
    res.redirect('/index');
});

module.exports = router;

