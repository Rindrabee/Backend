module.exports = (sequelize, DataTypes) => {

    const Message = sequelize.define("message", {
        Text: {
            type: DataTypes.STRING
        },
        id_sender: {
            type: DataTypes.INTEGER
        },
        id_received: {
            type: DataTypes.INTEGER
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }

    })

    return Message

}