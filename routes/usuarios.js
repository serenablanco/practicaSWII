const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const dbo = require('../db/conn');
const MAX_RESULTS = 20;

// Obtener todos los usuarios
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
        let usuarios = await db
            .collection('usuarios')
            .find(query)
            .limit(limit)
            .toArray();
        
        res.render('usuarios', {usuarios: usuarios})
        //res.status(200).json({ results: usuarios, next });
    } catch (err) {
        res.status(400).send('Error al buscar usuarios');
    }
});

// Obtener las recetas de un usuario
router.get('/:id/recetas', async (req, res) => {
    let limit = MAX_RESULTS;
    if (req.query.limit) {
        limit = Math.min(parseInt(req.query.limit), MAX_RESULTS);
    }
    const id = req.params.id; // Obtener el ID de la receta de los parámetros de la URL
    const db = dbo.getDb();
    try {
        let recetas = await db
            .collection('recetas')
            .find({ user_id: parseInt(id) }) // Buscar recetas por el ID del usuario
            .limit(limit)
            .project({Name: 1, user: 1})
            .toArray();

        if (!recetas || recetas.length === 0) {
            return res.status(404).send('No se encontraron recetas para este usuario');
        }

        res.render('recetasPorUsuario', { recetas: recetas, usuarioId: id });
        //res.status(200).json(recetas);
    } catch (err) {
        res.status(400).send('Error al buscar las recetas');
    }
});

// Obtener una receta específica a partir del usuario
router.get('/:usuarioId/recetas/:recetaId', async (req, res) => {
    const usuarioId = req.params.usuarioId; // Obtener el ID del usuario de los parámetros de la URL
    const recetaId = req.params.recetaId; // Obtener el ID de la receta de los parámetros de la URL

    const db = dbo.getDb();
    try {
        let receta = await db
            .collection('recetas')
            .findOne({ user_id: parseInt(usuarioId), _id: parseInt(recetaId) }); // Buscar la receta por el ID del usuario y el ID de la receta

        if (!receta) {
            return res.status(404).send('No se encontró la receta para este usuario');
        }

        res.status(200).json(receta);
    } catch (err) {
        res.status(400).send('Error al buscar la receta');
    }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id; // Obtener el ID del usuario de los parámetros de la URL
        const db = dbo.getDb();
        const result = await db
            .collection('usuarios')
            .deleteOne({ _id: parseInt(id) }); // Utilizar el ID personalizado en lugar de ObjectId
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'No existe el usuario con ese ID' });
        }
        res.status(200).json({ message: 'Usuario eliminada' });
    } catch (error) {
        res.status(400).json({ error: 'ID Inválido' });
    }
});


module.exports = router;