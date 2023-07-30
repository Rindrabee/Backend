const db = require('../models');
const bcrypt = require('bcrypt');
const secretKey = 'ma_clé_secrète';
const pageclient = require('../models/clientModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomText = require('random-text-generator');
const { any } = require('joi');



const Rendezvous = db.rendezvous;

//Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'garagetahinalisoa@gmail.com',
    clientId: '644760103972-mo2ahkelp1i9i4t8v6655chbsod8tukr.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04MD66QBz9KuxCgYIARAAGAQSNwF-L9IrpAc4S36Fvhb7ZkxGu5EmwTXtytAk9hjUNaFZYAA0xpLq95Dnwng1hsyKqmaCeSkD-NQ',
    accessToken: 'ya29.a0AbVbY6MyfFP8pXzypYfjy2pCftt9RxIqZr5_sXX9FZTXmJMySsEq45Scv3WXpilhIPdz4frv_pybKHO_UtS7AxmcJMCNhwKWkOc0N5shIyfOPZEXVSf7DcU0xAsdiod3bIUccUCbPpbKKeOHIIbmL8E6-ZUDaCgYKAZISARISFQFWKvPlyz_riUku6KsUtiDC45_k9g0163'
  },
  tls: {
    rejectUnauthorized: false
  }
});


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

  // Accepter une rendez-vous : 

  const accepterrendezvous = async (req, res) => {
    try {
      const id = req.params.id;
      const rendezvous = await Rendezvous.findByPk(id);
  
    if (!rendezvous) {
      return res.status(404).send("rendezvous not found");
    }


    const mailOptions = {
      from: 'garagetahinalisoa@gmail.com',
      to: rendezvous.Email,
      subject: 'Demmande de rendez-vous',
      text: `Bonjour on a bien reçu votre demande de rendez-vous et on accepter` 
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        console.error(error);
        res.send('Il y a une erreur sur l/envoie de mail');
      } else {
        res.send({ statut:true, msg: 'Email envoyer' });
      }
    })
      
    rendezvous.Etat  = 1;
      
     
    await rendezvous.save();

    res.status(200).send(rendezvous);
  
    } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}


// Reffuser rendez-vous 
const reffuser = async (req, res) => {
  let id = req.params.id
  await Rendezvous.destroy({ where: { id: id }} )
  res.status(200).send('Rendez vous annuler !')

}








module.exports = {
  ajouterrendez,
  listerrendezvous,
  accepterrendezvous,
  reffuser
}