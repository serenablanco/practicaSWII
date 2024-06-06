const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const dbo = require('../db/conn');
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

// Obtener todas las recetas
router.get('/', async (req, res) => {
    let limit = MAX_RESULTS;
    if (req.query.limit) {
        limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
    }

    let next = req.query.next;
    let query = {};

    if (next) {
        try {
            query = { _id: { $lt: new ObjectId(next) } };
        } catch (err) {
            return res.status(400).send('Error: ID de paginación inválido');
        }
    }

    const db = dbo.getDb();
    try {
        let recetas = await db
            .collection('recetas')
            .find(query)
            .limit(limit)
            .project({Name: 1, user: 1})
            .toArray();

        next = recetas.length === limit ? recetas[recetas.length - 1]._id : null;
        res.status(200).json({ results: recetas, next });
    } catch (err) {
        res.status(400).send('Error al buscar recetas');
    }
});

function generarNumeroUnico() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Crear una nueva receta
router.post('/', async (req, res) => {
  try {
    const db = dbo.getDb();

    let numeroUnico;
    let recetaExistente;

    do {
        numeroUnico = generarNumeroUnico();
        recetaExistente = await db.collection('recetas').findOne({ _id: numeroUnico });
    } while (recetaExistente);

    let result = await db
        .collection('recetas')
        .insertOne({ ...req.body, _id: numeroUnico });
    const jsonResponse= { id: numeroUnico, url: `${req.protocol}://${req.get('host')}${req.originalUrl}/${result.insertedId}` };
    console.log('Respuesta enviada al cliente:', jsonResponse);
    res.status(201).json(jsonResponse)
  } catch (error) {
    res.status(400).json({ error: 'Los parámetros proporcionados son incorrectos' });
  }
});

// Obtener una receta específica
router.get('/:id', async (req, res) => {
    const id = req.params.id; // Obtener el ID de la receta de los parámetros de la URL
    const db = dbo.getDb();
    try {
        let receta = await db
            .collection('recetas')
            .findOne({ _id: parseInt(id) }); // Buscar la receta por el ID

        if (!receta) {
            return res.status(404).send('Receta no encontrada');
        }

        res.status(200).json(receta);
    } catch (err) {
        res.status(400).send('Error al buscar la receta');
    }
});

// Modificar una receta específica
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id; // Obtener el ID de la receta de los parámetros de la URL
    
        // Construir el objeto de actualización con los campos que se desean modificar
        const update = {
            $set: {
            Name: req.body.Name,
            Time: req.body.Time,
            Category: req.body.Category,
            Ingredients: req.body.Ingredients,
            Instructions: req.body.Instructions
            }
        };
  
        const dbConnect = dbo.getDb();
        const result = await dbConnect
            .collection('recetas')
            .updateOne({ _id: parseInt(id) }, update); // Utilizar el ID personalizado en lugar de ObjectId
    
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'No se encontró la receta con ese ID' });
        }
  
        res.status(200).json({ id: id, mensaje: 'Receta actualizada exitosamente' });
    } catch (error) {
        res.status(400).json({ error: 'Los parámetros proporcionados son incorrectos' });
    }
});
  
  

// Eliminar una receta
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id; // Obtener el ID de la receta de los parámetros de la URL
        const db = dbo.getDb();
        const result = await db
            .collection('recetas')
            .deleteOne({ _id: parseInt(id) }); // Utilizar el ID personalizado en lugar de ObjectId
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'No existe la receta con ese ID' });
        }
        res.status(200).json({ message: 'Receta eliminada' });
    } catch (error) {
        res.status(400).json({ error: 'ID Inválido' });
    }
});

// Obtener las reseñas de una receta
router.get('/:id/reviews', async (req, res) => {
    const id = req.params.id; // Obtener el ID de la receta de los parámetros de la URL
    const db = dbo.getDb();
    try {
        let reviews = await db
            .collection('reviews')
            .find({ recipe_id: parseInt(id) }) // Buscar reseñas por el ID de la receta
            .toArray();

        if (!reviews || reviews.length === 0) {
            return res.status(404).send('No se encontraron reseñas para esta receta');
        }

        res.status(200).json(reviews);
    } catch (err) {
        res.status(400).send('Error al buscar las reseñas');
    }
});
  

module.exports = router;
