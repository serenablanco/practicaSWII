const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const { connectToDatabase } = require('./db/conn');

const indexRouter = require('./routes/index');
const recetasRouter = require('./routes/recetas');
const usuariosRouter = require('./routes/usuarios');
const categoriasRouter = require('./routes/categorias');

let app = express();

// Conectar a la base de datos
connectToDatabase();

// Configurar el motor de plantillas (view engine)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', indexRouter);
app.use(process.env.BASE_URI + '/recetas', recetasRouter);
app.use(process.env.BASE_URI + '/usuarios', usuariosRouter);
app.use(process.env.BASE_URI + '/categorias', categoriasRouter);

// Manejo de errores 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
