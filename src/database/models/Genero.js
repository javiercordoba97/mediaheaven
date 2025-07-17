module.exports = (sequelize, dataTypes) => {
    let alias = "Genero"; // <-- Alias singular y con mayúscula
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: dataTypes.STRING(255)
        }
    }
    let config = {
        tableName: "generos",
        timestamps: false,
    }
    const Genero = sequelize.define(alias, cols, config);

    Genero.associate = function(models){
        Genero.hasMany(models.Juego, {
            foreignKey: "id_genero",
            as: "Juegos"
        });
    } 

    return Genero;
}