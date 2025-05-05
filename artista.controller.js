const db = require("../models");
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// CREATE - Crear artista
exports.createArtista = async (req, res) => {
  try {
    const { nombre, generoId } = req.body;
    
    if (!nombre || !generoId) {
      return res.status(400).json({ error: "Nombre y género son requeridos" });
    }

    let imagenPath = null;
    if (req.files?.imagen) {
      const imagen = req.files.imagen;
      const extension = path.extname(imagen.name);
      const filename = `artista_${Date.now()}${extension}`;
      imagenPath = path.join(__dirname, '../uploads', filename);
      await imagen.mv(imagenPath);
      imagenPath = `/uploads/${filename}`;
    }

    const artista = await db.artista.create({
      nombre,
      imagen: imagenPath,
      generoId
    });

    res.status(201).json(artista);
  } catch (error) {
    res.status(500).json({ error: "Error al crear artista" });
  }
};

// READ ALL - Obtener todos los artistas con su género
exports.getAllArtistas = async (req, res) => {
  try {
    const artistas = await db.artista.findAll({
      include: [{ model: db.genero, as: 'genero' }]
    });
    res.json(artistas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener artistas" });
  }
};

// READ ONE - Obtener un artista por ID
exports.getArtistaById = async (req, res) => {
  try {
    const artista = await db.artista.findByPk(req.params.id, {
      include: [{ model: db.genero, as: 'genero' }]
    });
    
    if (!artista) {
      return res.status(404).json({ error: "Artista no encontrado" });
    }
    
    res.json(artista);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener artista" });
  }
};

// UPDATE - Actualizar artista
exports.updateArtista = async (req, res) => {
  try {
    const { nombre, generoId } = req.body;
    const artista = await db.artista.findByPk(req.params.id);
    
    if (!artista) {
      return res.status(404).json({ error: "Artista no encontrado" });
    }

    // Manejo de imagen
    let imagenPath = artista.imagen;
    if (req.files?.imagen) {
      // Eliminar imagen anterior si existe
      if (imagenPath) {
        try {
          await unlinkAsync(path.join(__dirname, '..', imagenPath));
        } catch (e) {
          console.log("Error al eliminar imagen anterior:", e);
        }
      }

      const imagen = req.files.imagen;
      const extension = path.extname(imagen.name);
      const filename = `artista_${Date.now()}${extension}`;
      const newPath = path.join(__dirname, '../uploads', filename);
      await imagen.mv(newPath);
      imagenPath = `/uploads/${filename}`;
    }

    await artista.update({
      nombre: nombre || artista.nombre,
      imagen: imagenPath,
      generoId: generoId || artista.generoId
    });

    res.json(artista);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar artista" });
  }
};

// DELETE - Eliminar artista
exports.deleteArtista = async (req, res) => {
  try {
    const artista = await db.artista.findByPk(req.params.id);
    
    if (!artista) {
      return res.status(404).json({ error: "Artista no encontrado" });
    }

    // Eliminar imagen si existe
    if (artista.imagen) {
      try {
        await unlinkAsync(path.join(__dirname, '..', artista.imagen));
      } catch (e) {
        console.log("Error al eliminar imagen:", e);
      }
    }

    await artista.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar artista" });
  }
};

// Obtener artistas por género
exports.getArtistasByGenero = async (req, res) => {
  try {
    const artistas = await db.artista.findAll({
      where: { generoId: req.params.generoId },
      include: [{ model: db.genero, as: 'genero' }]
    });
    res.json(artistas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener artistas por género" });
  }
};