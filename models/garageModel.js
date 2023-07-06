module.exports = (sequelize, DataTypes) => {

    const Garage = sequelize.define("garage", {
        Nom: {
            type: DataTypes.STRING
        },
        Adresse: {
            type: DataTypes.STRING
        },
        Telephone: {
            type: DataTypes.STRING
        },
        Email : {
            type: DataTypes.STRING
        },
        Specialite: {
            type: DataTypes.STRING
        },
        Heures_ouverture: {
            type: DataTypes.STRING
        },
        Heures_fermeture: {
            type: DataTypes.STRING
        },
        service_offerte: {
            type: DataTypes.STRING
        },
        Photo: {
            type: DataTypes.STRING
        },
        equipement: {
            type: DataTypes.STRING
        },
        Password: {
            type: DataTypes.STRING
        },
        Etat: {
            type: DataTypes.BOOLEAN,
            default: false
        }

    })

    return Garage

}