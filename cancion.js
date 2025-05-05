const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Cancion = sequelize.define(
        'Cancion',
        {
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: "El nombre de la canción no puede estar vacío",
                    },
                    len: [2, 100],
                },
            },
            archivo: {
                type: DataTypes.STRING, // Ruta del archivo MP3
                allowNull: false,
            }
        },
        {
            tableName: "canciones",
            timestamps: true,
        }
    );
    return Cancion;
};