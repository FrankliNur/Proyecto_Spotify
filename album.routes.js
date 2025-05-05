module.exports = app => {
    const router = require('express').Router();
    const controller = require('../controllers/album.controller');

    // CRUD Completo
    router.post('/', controller.createAlbum);
    router.get('/', controller.getAllAlbums);
    router.get('/:id', controller.getAlbumById);
    router.put('/:id', controller.updateAlbum);
    router.delete('/:id', controller.deleteAlbum);

    // Ruta especial para frontend
    router.get('/by-artista/:artistaId', controller.getAlbumsByArtista);

    app.use('/albums', router);
};