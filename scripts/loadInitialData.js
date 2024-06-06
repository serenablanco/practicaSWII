const fs = require('fs');
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/libro_recetas"; 

async function loadInitialData() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db('libro_recetas'); 

    // Lee los archivos JSON
    const recetas = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/recetas.json'), 'utf8'));
    const usuarios = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/usuarios.json'), 'utf8'));
    const categorias = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categorias.json'), 'utf8'));
    const reviews = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/reviews.json'), 'utf8'));

    // Obtén las colecciones
    const recetasCollection = db.collection('recetas');
    const usuariosCollection = db.collection('usuarios');
    const categoriasCollection = db.collection('categorias');
    const reviewsCollection = db.collection('reviews');

    // Elimina los datos existentes
    await recetasCollection.deleteMany({});
    await usuariosCollection.deleteMany({});
    await categoriasCollection.deleteMany({});
    await reviewsCollection.deleteMany({});

    // Inserta los datos iniciales
    await recetasCollection.insertMany(recetas);
    await usuariosCollection.insertMany(usuarios);
    await categoriasCollection.insertMany(categorias);
    await reviewsCollection.insertMany(reviews);

    console.log('Datos iniciales cargados correctamente');
  } catch (error) {
    console.error('Error al cargar los datos iniciales:', error);
  } finally {
    await client.close();
  }
}

loadInitialData();
