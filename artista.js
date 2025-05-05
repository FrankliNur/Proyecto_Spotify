const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Artista = sequelize.define('Artista', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING
        },
        generoId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Generos', // Asegúrate que coincida exactamente con tu tabla en DB
                key: 'id'
            }
        }
    }, {
        tableName: 'Artistas', // Nombre exacto de la tabla en la base de datos
        timestamps: true // Asegúrate que coincida con tu configuración
    });
    return Artista;
};