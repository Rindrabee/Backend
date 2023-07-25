const bcrypt = require('bcrypt');
const db = require('../models');


const Rendezvous = db.rendezvous;


//Ajouter un nouveau rendezvous

const ajouterrendez = async (req, res) => {

    try {
    const propriete = {
    Nom: req.body.Nom,
    Email: req.body.Email,
    Telephone: req.body.Telephone,
    Date: req.body.Date,
    Heure: req.body.Heure,
    id_garage: req.body.id_garage,
   
    };
  
    const rendezvous = await Rendezvous.create(propriete);
   
  
    res.status(200).send(rendezvous);
    console.log(rendezvous);
    } catch (error) {
      console.error(error);
      res.status(500).send("Une erreur s'est produite lors de l'envoie de l'urgence.");
    }
  };

  // Lister les rendez-vous

  const listerrendezvous = async (req, res) => {
    try {
      const rendezvous = await Rendezvous.findAll(); 
      res.json(rendezvous);
    } catch(error) {
      res.status(500).json({ error: 'Erreur lors de la récupération' });
      console.log(error);
    }
  }



module.exports = {
    ajouterrendez,
    listerrendezvous
}