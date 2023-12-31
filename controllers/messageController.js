const bcrypt = require('bcrypt');
const db = require('../models');

// create main Model
const Message = db.messages;
const Message2 = db.messages2;
const Message3 = db.messages3;
const Mecanicien = db.mecaniciens;

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

// Lister message 3 
const listermessage3 = async (req, res) => {
    try {
        const messages3 = await Message3.findAll(); 
        res.json(messages3);
    } catch(error) {
        res.status(500).json({ error: 'Erreur lors de la récupération' });
        console.log(error);
    }
};


// Supprimer message 

const deletemessage = async (req, res) => {
    try {
        await Message2.destroy({ where: {} }); 
        res.status(200).send('Tous les messages ont été supprimés !');
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la suppression des messages :', error);
        res.status(500).send('Une erreur s\'est produite lors de la suppression des messages.');
    }
};


// Supprimer message 3

const deletemessage3 = async (req, res) => {
    try {
        await Message3.destroy({ where: {} }); 
        res.status(200).send('Tous les messages ont été supprimés !');
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la suppression des messages :', error);
        res.status(500).send('Une erreur s\'est produite lors de la suppression des messages.');
    }
};


module.exports = {
    listermessage,
    listermessage2,
    deletemessage,
    listermessage3,
    deletemessage3
}