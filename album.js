const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Album = sequelize.define('Album', {
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El nombre del álbum no puede estar vacío"
                },
                len: {
                    args: [2, 100],
                    msg: "El nombre debe tener entre 2 y 100 caracteres"
                }
            }
        },
        imagen: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
              // Elimina la validación isUrl o reemplázala por algo más adecuado
            notContains: {
                args: [' '],
                msg: "La ruta de la imagen no debe contener espacios"
            }
            }
        },
        artistaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Artistas',
                key: 'id'
            }
        }
    }, {
        tableName: 'Albums',
        timestamps: true
    });
    return Album;
};