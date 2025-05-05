module.exports = app => {
    const router = require('express').Router();
    const controller = require('../controllers/artista.controller');

    // CRUD Completo
    router.post('/', controller.createArtista);
    router.get('/', controller.getAllArtistas);
    router.get('/:id', controller.getArtistaById);
    router.put('/:id', controller.updateArtista);
    router.delete('/:id', controller.deleteArtista);

    // Ruta especial para frontend
    router.get('/by-genero/:generoId', controller.getArtistasByGenero);

    app.use('/artistas', router);
};