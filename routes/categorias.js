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

        res.render('categorias', {categorias: categorias})
        //res.status(200).json({ results: categorias, next });
    } catch (err) {
        res.status(400).send('Error al buscar categorias');
    }
});

// Obtener las recetas de una categoria
router.get('/:category/recetas', async (req, res) => {
    let limit = MAX_RESULTS;
    if (req.query.limit) {
        limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
    }

    const category = req.params.category; // Obtener el nombre de la categoría de los parámetros de la URL
    const db = dbo.getDb();
    try {
        let recipes = await db
            .collection('recetas')
            .find({ Category: category }) // Buscar recetas por el nombre de la categoría
            .project({Name: 1, Category: 1})
            .limit(limit)
            .toArray();

        if (!recipes || recipes.length === 0) {
            return res.status(404).send('No se encontraron recetas para esta categoría');
        }

        res.render('recetasPorCategoria', { recetas: recipes, categoria: category });
        //res.status(200).json(recipes);
    } catch (err) {
        res.status(400).send('Error al buscar las recetas');
    }
});

// Obtener una receta específica a partir de la categoría
router.get('/:category/recetas/:recetaId', async (req, res) => {
    const categoria = req.params.category; 
    const recetaId = req.params.recetaId; // Obtener el ID de la receta de los parámetros de la URL

    const db = dbo.getDb();
    try {
        let receta = await db
            .collection('recetas')
            .findOne({ Category: categoria, _id: parseInt(recetaId) }); // Buscar la receta por el ID del usuario y el ID de la receta

        if (!receta) {
            return res.status(404).send('No se encontró la receta');
        }

        res.status(200).json(receta);
    } catch (err) {
        res.status(400).send('Error al buscar la receta');
    }
});


module.exports = router;
