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
            type: DataTypes.STRING
        },
        latitude: {
            type: DataTypes.STRING
        },
        Etat: {
            type: DataTypes.BOOLEAN,
            default: false
        },
    })

    return Urgence

}