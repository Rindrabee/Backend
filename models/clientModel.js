module.exports = (sequelize, DataTypes) => {

    const Client = sequelize.define("client", {
        Nom: {
            type: DataTypes.STRING
        },
        Prenoms: {
            type: DataTypes.STRING
        },
        Naissance: {
            type: DataTypes.STRING
        },
        Profession : {
            type: DataTypes.STRING
        },
        Adresse: {
            type: DataTypes.STRING
        },
        Sexe:{
            type: DataTypes.STRING
        },
        Telephone: {
            type: DataTypes.STRING
        },
        Email: {
            type: DataTypes.STRING
        },
        Password: {
            type: DataTypes.STRING
        },
        Photo: {
            type: DataTypes.STRING
        },
        Codevalidator: {
            type: DataTypes.STRING
        },
        Validation: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        Etat: {
            type: DataTypes.BOOLEAN,
            default: false
        }
        

    })

    return Client

}