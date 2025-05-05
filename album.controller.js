const db = require("../models");
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// CREATE - Crear álbum
exports.createAlbum = async (req, res) => {
    try {
        const { nombre, artistaId } = req.body;
        if (!nombre || !artistaId) {
            return res.status(400).json({ error: "Nombre y artista son requeridos" });
        }

        // Verificar que el artista existe
        const artista = await db.artista.findByPk(artistaId);
        if (!artista) {
            return res.status(400).json({ error: "El artista especificado no existe" });
        }

        let imagenPath = null;
        if (req.files?.imagen) {
            const imagen = req.files.imagen;
            const extension = path.extname(imagen.name);
            const filename = `album_${Date.now()}${extension}`;
            imagenPath = path.join(__dirname, '../uploads', filename);
            await imagen.mv(imagenPath);
            imagenPath = `/uploads/${filename}`;
        }

        const album = await db.album.create({ 
            nombre, 
            artistaId,
            imagen: imagenPath 
        });
        
        res.status(201).json(album);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Error al crear álbum",
            details: error.errors?.map(e => e.message) || error.message 
        });
    }
};

// UPDATE - Actualizar álbum (modificado para manejar imágenes)
exports.updateAlbum = async (req, res) => {
    try {
        const { nombre, artistaId } = req.body;
        const album = await db.album.findByPk(req.params.id);
        
        if (!album) {
            return res.status(404).json({ error: "Álbum no encontrado" });
        }

        // Verificar que el artista existe si se está actualizando
        if (artistaId) {
            const artista = await db.artista.findByPk(artistaId);
            if (!artista) {
                return res.status(400).json({ error: "El artista especificado no existe" });
            }
        }

        // Manejo de imagen
        let imagenPath = album.imagen;
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
            const filename = `album_${Date.now()}${extension}`;
            const newPath = path.join(__dirname, '../uploads', filename);
            await imagen.mv(newPath);
            imagenPath = `/uploads/${filename}`;
        }

        await album.update({
            nombre: nombre || album.nombre,
            artistaId: artistaId || album.artistaId,
            imagen: imagenPath
        });

        res.json(album);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            error: "Error al actualizar álbum",
            details: error.errors?.map(e => e.message) || error.message
        });
    }
};

// DELETE - Eliminar álbum (modificado para eliminar imagen)
exports.deleteAlbum = async (req, res) => {
    try {
        const album = await db.album.findByPk(req.params.id);
        
        if (!album) {
            return res.status(404).json({ error: "Álbum no encontrado" });
        }

        // Eliminar imagen si existe
        if (album.imagen) {
            try {
                await unlinkAsync(path.join(__dirname, '..', album.imagen));
            } catch (e) {
                console.log("Error al eliminar imagen:", e);
            }
        }

        await album.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar álbum" });
    }
};


// READ ALL - Obtener todos los álbumes con su artista
exports.getAllAlbums = async (req, res) => {
  try {
      const albums = await db.album.findAll({
          include: [{ model: db.artista, as: 'artista' }]
      });
      res.json(albums);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener álbumes" });
  }
};

// READ ONE - Obtener un álbum por ID
exports.getAlbumById = async (req, res) => {
  try {
      const album = await db.album.findByPk(req.params.id, {
          include: [{ model: db.artista, as: 'artista' }]
      });
      
      if (!album) {
          return res.status(404).json({ error: "Álbum no encontrado" });
      }
      
      res.json(album);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener álbum" });
  }
};
// Obtener álbumes por artista
exports.getAlbumsByArtista = async (req, res) => {
    try {
        const albums = await db.album.findAll({
            where: { artistaId: req.params.artistaId },
            include: [{ model: db.artista, as: 'artista' }]
        });
        res.json(albums);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener álbumes por artista" });
    }
};