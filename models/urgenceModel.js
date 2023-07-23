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
        Latitude: {
            type: DataTypes.FLOAT 
        },
        Longitude: {
            type: DataTypes.FLOAT 
        },
        Etat: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        id_garage: {
            type: DataTypes.INTEGER
        },
        id_mecanicien: {
            type: DataTypes.INTEGER
        },
    })

    return Urgence

}