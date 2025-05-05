const db = require("../models");
const path = require('path');
const fs = require('fs');

// Configuración para guardar imágenes
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Obtener todas las generos
exports.getgeneroList = async (req, res) => {
    const generos = await db.genero.findAll();
    res.send(generos);
};

// Obtener genero por ID
exports.getgeneroById = async (req, res) => {
    const { id } = req.params;
    const genero = await db.genero.findByPk(id);
    if (!genero) {
        return res.status(404).send({ message: 'genero no encontrada' });
    }
    res.send(genero);
};

// Crear una genero con imagen
exports.postgeneroCreate = async (req, res) => {
    const { nombre } = req.body;
    
    if (!nombre) {
        return res.status(400).send({ message: "El nombre es requerido" });
    }

    let imagenPath = null;
    if (req.files && req.files.imagen) {
        const imagen = req.files.imagen;
        const extension = path.extname(imagen.name);
        const filename = `${Date.now()}${extension}`;
        imagenPath = path.join(uploadDir, filename);
        await imagen.mv(imagenPath);
        imagenPath = `/uploads/${filename}`; // Ruta relativa para guardar en DB
    }

    const generoSaved = await db.genero.create({ 
        nombre,
        imagen: imagenPath 
    });
    res.status(201).send(generoSaved);
};

// Actualizar genero (PUT)
exports.putgeneroUpdate = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).send({ message: "Se requiere el nombre" });
    }

    const genero = await db.genero.findByPk(id);
    if (!genero) {
        return res.status(404).send({ message: 'genero no encontrada' });
    }

    let imagenPath = genero.imagen;
    if (req.files && req.files.imagen) {
        // Eliminar imagen anterior si existe
        if (imagenPath) {
            const oldImagePath = path.join(__dirname, '..', imagenPath);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const imagen = req.files.imagen;
        const extension = path.extname(imagen.name);
        const filename = `${Date.now()}${extension}`;
        const newImagePath = path.join(uploadDir, filename);
        await imagen.mv(newImagePath);
        imagenPath = `/uploads/${filename}`;
    }

    genero.nombre = nombre;
    genero.imagen = imagenPath;
    await genero.save();
    res.send(genero);
};

// Eliminar genero (y su imagen)
exports.deletegenero = async (req, res) => {
    const { id } = req.params;
    const genero = await db.genero.findByPk(id);
    if (!genero) {
        return res.status(404).send({ message: 'genero no encontrada' });
    }

    // Eliminar imagen asociada si existe
    if (genero.imagen) {
        const imagePath = path.join(__dirname, '..', genero.imagen);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    await genero.destroy();
    res.status(204).send();
};
//-----------------------------------------------------------------------\\
exports.patchgeneroUpdate = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    const genero = await db.genero.findByPk(id);
    if (!genero) {
        return res.status(404).send({ message: 'genero no encontrada' });
    }

    // Actualizar solo los campos proporcionados
    if (nombre) genero.nombre = nombre;

    // Manejo de imagen si se proporciona
    if (req.files && req.files.imagen) {
        // Eliminar imagen anterior si existe
        if (genero.imagen) {
            const oldImagePath = path.join(__dirname, '..', genero.imagen);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        const imagen = req.files.imagen;
        const extension = path.extname(imagen.name);
        const filename = `${Date.now()}${extension}`;
        const newImagePath = path.join(uploadDir, filename);
        await imagen.mv(newImagePath);
        genero.imagen = `/uploads/${filename}`;
    }

    await genero.save();
    res.send(genero);
};