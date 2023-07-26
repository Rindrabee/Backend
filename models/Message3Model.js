module.exports = (sequelize, DataTypes) => {

    const Message3 = sequelize.define("message3", {
        Text: {
            type: DataTypes.STRING
        },
        id_sendermecanicien: {
            type: DataTypes.INTEGER
        },
        id_receivedmecanicien: {
            type: DataTypes.INTEGER
        },
        id_sendergarage: {
            type: DataTypes.INTEGER
        },
        id_receivedgarage: {
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

    return Message3

}