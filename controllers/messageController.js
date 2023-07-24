const bcrypt = require('bcrypt');
const db = require('../models');

// create main Model
const Message = db.messages;
const Message2 = db.messages2;

const listermessage = async (req, res) => {
    try {
        const messages = await Message.findAll(); 
        res.json(messages);
    } catch(error) {
        res.status(500).json({ error: 'Erreur lors de la récupération' });
        console.log(error);
    }
};

const listermessage2 = async (req, res) => {
    try {
        const messages2 = await Message2.findAll(); 
        res.json(messages2);
    } catch(error) {
        res.status(500).json({ error: 'Erreur lors de la récupération' });
        console.log(error);
    }
};

module.exports = {
    listermessage,
    listermessage2
}