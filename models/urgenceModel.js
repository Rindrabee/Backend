module.exports = (sequelize, DataTypes) => {

    const Urgence = sequelize.define("urgence", {
        Nom: {
            type: DataTypes.STRING
        },
        Email: {
            type: DataTypes.STRING
        },
        Telephone: {
            type: DataTypes.STRING
        },
        Adresse: {
            type: DataTypes.STRING
        },
        Probleme: {
            type: DataTypes.STRING
        },
        longitude: {
            type: DataTypes.INTEGER
        },
        latitude: {
            type: DataTypes.INTEGER
        },
        Etat: {
            type: DataTypes.BOOLEAN,
            default: false
        },
    })

    return Urgence

}