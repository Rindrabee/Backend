module.exports = (sequelize, DataTypes) => {

    const Admin = sequelize.define("admin", {
        Nom: {
            type: DataTypes.STRING
        },
        Prenoms: {
            type: DataTypes.STRING
        },
        Naissance: {
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
        }
    })

    return Admin

}