module.exports = (sequelize, DataTypes) => {

    const Message2 = sequelize.define("message2", {
        Text: {
            type: DataTypes.STRING
        },
        id_senderclient: {
            type: DataTypes.INTEGER
        },
        id_receivedclient: {
            type: DataTypes.INTEGER
        },
        id_sendermecanicien: {
            type: DataTypes.INTEGER
        },
        id_receivedmecanicien: {
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

    return Message2

}