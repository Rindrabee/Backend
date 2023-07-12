const bcrypt = require('bcrypt');
const db = require('../models');

// create main Model
const Message = db.messages;

const listermessage = async (req, res) => {
    
    try {
        const messages = await Message.findAll(); 
        res.json(messages);
    } catch(error) {
        res.status(500).json({ error: 'Erreur lors de la récupération' });
        console.log(error);
    }
};

module.exports = {
    listermessage,
}