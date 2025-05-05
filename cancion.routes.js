const express = require('express'); // Añade esta línea al inicio

module.exports = app => {
const controller = require("../controllers/cancion.controller");

const router = express.Router();
router.get("/", controller.getCanciones);
router.post("/create", controller.createCancion);
router.put("/:id", controller.putCancionUpdate);
router.get("/:id", controller.getCancionById);
router.delete("/:id", controller.deleteCancion);

app.use('/api/canciones', router);
};