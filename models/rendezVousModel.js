module.exports = (sequelize, DataTypes) => {

    const Rendezvous = sequelize.define("rendezvous", {
        Nom: {
            type: DataTypes.STRING
        },
        Email: {
            type: DataTypes.STRING
        },
        Telephone: {
            type: DataTypes.STRING
        },
        Date: {
            type: DataTypes.DATEONLY
        },
        Heure: {
            type: DataTypes.TIME
        },
        id_garage: {
            type: DataTypes.INTEGER
        },
        Etat: {
            type: DataTypes.BOOLEAN,
            default: false
        },
      
    })

    return Rendezvous

}