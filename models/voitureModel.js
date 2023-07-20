module.exports = (sequelize, DataTypes) => {

    const Voiture = sequelize.define("voiture", {
        Numero: {
            type: DataTypes.STRING
        },
        Nom: {
            type: DataTypes.STRING
        },
        Probleme: {
            type: DataTypes.STRING
        },
        Date1: {
            type: DataTypes.STRING
        },
        Photo: {
            type: DataTypes.STRING
        },
        Idgarage: {
            type: DataTypes.INTEGER
        },
        Etat: {
            type: DataTypes.BOOLEAN,
            default: false
        },
    })

    return Voiture

}