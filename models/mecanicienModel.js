module.exports = (sequelize, DataTypes) => {

    const Mecanicien = sequelize.define("mecanicien", {
        Nom: {
            type: DataTypes.STRING
        },
        Prenoms: {
            type: DataTypes.STRING
        },
        Naissance: {
            type: DataTypes.STRING
        },
        Adresse:{
            type: DataTypes.STRING
        },
        Sexe: {
            type: DataTypes.STRING
        },
        Telephone : {
            type: DataTypes.STRING
        },
        Specialite: {
            type: DataTypes.STRING
        },
        Email: {
            type: DataTypes.STRING
        },
        Experience: {
            type: DataTypes.STRING
        },
        certification: {
            type: DataTypes.STRING
        },
        langue_parle: {
            type: DataTypes.STRING
        },
        Password: {
            type: DataTypes.STRING
        },
        Photo: {
            type: DataTypes.STRING
        },
        Etat: {
            type: DataTypes.BOOLEAN
        },
        Etat2: {
            type: DataTypes.BOOLEAN
        },
        id_garage: {
            type: DataTypes.INTEGER
        },
        id_urgence: {
            type: DataTypes.INTEGER
        },
        point:{
            type: DataTypes.INTEGER
        }

    })

    return Mecanicien

}