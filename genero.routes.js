module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/genero.controller.js");

    router.get("/", controller.getgeneroList);
    router.get("/:id", controller.getgeneroById);
    router.post("/", controller.postgeneroCreate);
    router.put("/:id", controller.putgeneroUpdate);
    router.patch("/:id", controller.patchgeneroUpdate);
    router.delete("/:id", controller.deletegenero);
    app.use('/generos', router);
};