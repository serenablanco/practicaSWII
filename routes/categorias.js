const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const dbo = require('../db/conn');
const MAX_RESULTS = parseInt(process.env.MAX_RESULTS);

// Obtener todas las categorias
router.get('/', async (req, res) => {

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
        let categorias = await db
            .collection('categorias')
            .find(query)
            .toArray();

        //res.render('categorias', {categorias: categorias})
        res.status(200).json({ results: categorias, next });
    } catch (err) {
        res.status(400).send('Error al buscar categorias');
    }
});

// Obtener las recetas de una categoria
router.get('/:id/recetas', async (req, res) => {
    let limit = MAX_RESULTS;
    if (req.query.limit) {
        limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
    }

    const categoryId = parseInt(req.params.id); // Obtener el ID de la categoría de los parámetros de la URL
    const db = dbo.getDb();
    try {
        // Buscar el nombre de la categoría por el ID
        const categoria = await db
            .collection('categorias')
            .findOne({ _id: categoryId });

        if (!categoria) {
            return res.status(404).send('No se encontró la categoría');
        }

        // Usar el nombre de la categoría para filtrar las recetas
        const recipes = await db
            .collection('recetas')
            .find({ Category: categoria.category }) // Filtrar recetas por el nombre de la categoría
            .project({ Name: 1, Category: 1 })
            .limit(limit)
            .toArray();

        if (!recipes || recipes.length === 0) {
            return res.status(404).send('No se encontraron recetas para esta categoría');
        }

        res.status(200).json(recipes);
    } catch (err) {
        res.status(400).send('Error al buscar las recetas');
    }
});


// Obtener una receta específica a partir de la categoría
router.get('/:categoryId/recetas/:recetaId', async (req, res) => {
    const recetaId = req.params.recetaId; // Obtener el ID de la receta de los parámetros de la URL
    const categoryId = parseInt(req.params.categoryId);

    const db = dbo.getDb();
    try {
        const categoria = await db
            .collection('categorias')
            .findOne({ _id: categoryId });

        if (!categoria) {
            return res.status(404).send('No se encontró la categoría');
        }

        let receta = await db
            .collection('recetas')
            .findOne({ Category: categoria.category, _id: parseInt(recetaId) }); // Buscar la receta por el ID del usuario y el ID de la receta

        if (!receta) {
            return res.status(404).send('No se encontró la receta');
        }

        res.status(200).json(receta);
    } catch (err) {
        res.status(400).send('Error al buscar la receta');
    }
});

// Obtener las reseñas de una receta específica a partir de la categoría
router.get('/:categoryId/recetas/:recetaId/reviews', async (req, res) => {
    const categoryId = parseInt(req.params.categoryId);
    const recetaId = req.params.recetaId; // Obtener el ID de la receta de los parámetros de la URL

    const db = dbo.getDb();
    try {
        const categoria = await db
            .collection('categorias')
            .findOne({ _id: categoryId });

        if (!categoria) {
            return res.status(404).send('No se encontró la categoría');
        }

        let receta = await db
            .collection('recetas')
            .findOne({ Category: categoria.category, _id: parseInt(recetaId) }); // Buscar la receta por el ID de la categoría y el ID de la receta

        if (!receta) {
            return res.status(404).send('No se encontró la receta');
        }

        let reseñas = await db
            .collection('reviews')
            .find({ recipe_id: parseInt(recetaId) })
            .toArray();

        res.status(200).json(reseñas);
    } catch (err) {
        res.status(400).send('Error al buscar las reseñas para la receta');
    }
});


module.exports = router;
