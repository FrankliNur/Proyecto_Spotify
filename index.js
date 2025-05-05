const { sequelize } = require("../config/db.config");
const genero = require("./genero")(sequelize);
const artista = require("./artista")(sequelize);
const album = require("./album")(sequelize);
const cancion = require("./cancion")(sequelize);
// Relaciones
genero.hasMany(artista, {
  foreignKey: 'generoId',
  as: 'artistas',
  onDelete: 'CASCADE' // Opcional pero recomendado
});

artista.belongsTo(genero, {
  foreignKey: 'generoId',
  as: 'genero',
  onDelete: 'CASCADE'
});

artista.hasMany(album, {
  foreignKey: 'artistaId',
  as: 'albums',
  onDelete: 'CASCADE'
});

album.belongsTo(artista, {
  foreignKey: 'artistaId',
  as: 'artista',
  onDelete: 'CASCADE'
});


album.hasMany(cancion, { foreignKey: "albumId", as: "canciones" });
cancion.belongsTo(album, { foreignKey: "albumId", as: "album" });
module.exports = {
  genero,
  artista,
  album,
  cancion,
  sequelize,
  Sequelize: sequelize.Sequelize
};