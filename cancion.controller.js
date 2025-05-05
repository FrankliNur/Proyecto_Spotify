const db = require("../models");
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);


//ver todas las ccanciones
exports.getCanciones = async (req, res) => {
  try {
    const canciones = await db.cancion.findAll({
      include: [{ model: db.album, as: "album" }],
    });
    res.json(canciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener canciones" });
  }
};

// CREATE - Subir canción

exports.createCancion = async (req, res) => {
  try {
    const { nombre, albumId } = req.body;

    if (!nombre || !albumId) {
      return res.status(400).json({ error: "Nombre y álbum son requeridos" });
    }

    if (!req.files?.archivo) {
      return res.status(400).json({ error: "Archivo MP3 requerido" });
    }

    const archivo = req.files.archivo;
    const extension = path.extname(archivo.name).toLowerCase();

    if (extension !== ".mp3") {
      return res.status(400).json({ error: "Solo se permiten archivos MP3" });
    }

    const filename = `cancion_${Date.now()}${extension}`;
    const uploadPath = path.join(__dirname, "../uploads/audio", filename);

    if (!fs.existsSync(path.dirname(uploadPath))) {
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
    }

    await archivo.mv(uploadPath);
    const archivoPath = `/uploads/audio/${filename}`;

    const cancion = await db.cancion.create({
      nombre,
      archivo: archivoPath,
      albumId,
    });

    res.status(201).json(cancion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear canción" });
  }
};

// UPDATE - Actualizar canción (PUT)
exports.putCancionUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, albumId } = req.body;

    const cancion = await db.cancion.findByPk(id);

    if (!cancion) {
      return res.status(404).json({ message: "Canción no encontrada" });
    }

    if (nombre) cancion.nombre = nombre;
    if (albumId) cancion.albumId = albumId;

    // Si se carga un nuevo archivo
    if (req.files && req.files.archivo) {
      const archivo = req.files.archivo;
      const extension = path.extname(archivo.name);
      const filename = `cancion_${Date.now()}${extension}`;
      const rutaFinal = path.join(__dirname, "../uploads/audio", filename);

      // Eliminar el archivo anterior si existe
      if (cancion.archivo) {
        const rutaAnterior = path.join(__dirname, "..", cancion.archivo);
        if (fs.existsSync(rutaAnterior)) {
          await unlinkAsync(rutaAnterior);
        }
      }

      // Guardar nuevo archivo
      await archivo.mv(rutaFinal);
      cancion.archivo = `/uploads/audio/${filename}`;
    }

    await cancion.save();
    res.json(cancion);
  } catch (error) {
    console.error("Error al actualizar la canción:", error);
    res.status(500).json({ message: "Error al actualizar la canción" });
  }
};



// GET - Obtener canción por ID
exports.getCancionById = async (req, res) => {
  try {
    const { id } = req.params;
    const cancion = await db.cancion.findByPk(id, {
      include: [{ model: db.album, as: "album" }],
    });

    if (!cancion) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    res.json(cancion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener canción" });
  }
};
// DELETE - Eliminar canción
exports.deleteCancion = async (req, res) => {
  try {
    const cancion = await db.cancion.findByPk(req.params.id);

    if (!cancion) {
      return res.status(404).json({ error: "Canción no encontrada" });
    }

    if (cancion.archivo) {
      try {
        await unlinkAsync(path.join(__dirname, "..", cancion.archivo));
      } catch (e) {
        console.error("Error al eliminar archivo:", e);
      }
    }

    await cancion.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar canción" });
  }
};