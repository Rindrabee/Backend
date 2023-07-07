const db = require('../models');
const bcrypt = require('bcrypt');
const secretKey = 'ma_clé_secrète';
const pageclient = require('../models/clientModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomText = require('random-text-generator');
const { any } = require('joi');


// TAm za nitesta message tam phone
const accountSid = 'AC70c9c21e1b2d040670b7c4ee0a2468cc'; 
const authToken = 'c4f54737f1292afaca4df34e4df88a6d'; 
const izaho = require('twilio')(accountSid, authToken);


// create main Model
const Client = db.clients;
const Admin = db.admins;

//Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'garagetahinalisoa@gmail.com',
    clientId: '644760103972-mo2ahkelp1i9i4t8v6655chbsod8tukr.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04om-J-KNGonICgYIARAAGAQSNwF-L9IrLo-ygUJ5MPipCpvbLZV_2ajb_GBxIC-PqhOoJPEc7CEemjGOW17xKWdnyhZbzWavun0',
    accessToken: 'ya29.a0AbVbY6OXSpR4RVYXO1UWKLqU4zcbA0ISn8EzomnMTLoO4cV_Afdg3K0KqtbUG6Mn7KFN4DAESB2-63yLcluie9aDdFVibzGuSUvOVV_eB40hA4UFFddO6E-lFBOVUQhkvV9lSc9WmpVO15iHaqK5W-SQ93ptaCgYKAZMSARISFQFWKvPl-pI2mCQIB7D3CO5apOJG_w0163'
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Code en random 
const rondom = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i =0; i < 6 ; i++) {
    code+= characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

//Mot de passe oublier
const rondom2 = () => {
  const characters = '0123456789';
  let code = '';
  for (let i =0; i < 6 ; i++) {
    code+= characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}


// main work

//login 

const login = async (req, res) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;

    const client = await Client.findOne({ where: { Email: email }});
    if (!client) {
      return res.send({ status:false,message:'Vérifier bien votre email' });
    }

    const passwordMatch = await bcrypt.compare(password, client.Password);
    if (!passwordMatch) {
      return res.send({ status:false,message:'Vérifier bien votre mot de passe' });
    }
    
    if (client.Validation != 1) {
      return res.send({ status:false,message:'Code de validation non envoyer veuillez réinscire'});
    }
   
    const token = jwt.sign({ clientId: client.id }, 'secret_key', { expiresIn: '1h' });

    res.json({ status:true,token:token });
    
    
  } catch (error) {
    console.error(error);
    res.send("Une erreur s'est produite lors de la connexion.");
  }
};

// Deconnexion
const logout = async (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie." });
 
};

const addClient = async (req, res) => {

    const crypto = require('crypto');

// Generate a random string of 8 characters
const randomString = crypto.randomBytes(4).toString('hex');

// Create the random filename
const filename = `${randomString}.jpg`;


    const base64 = req.body.Photo
    var base64Data = base64.replace(/^data:image\/png;base64,/, "");

require("fs").writeFile(filename, base64Data, 'base64', function(err) {
  console.log(err);
});
  try {
    const hashedPassword = await bcrypt.hash(req.body.Password, 10);
    const confirmationcode = rondom();

    const propriete = {
      Nom: req.body.Nom,
      Prenoms: req.body.Prenoms,
      Naissance: req.body.Naissance,
      Profession: req.body.Profession,
      Adresse: req.body.Adresse,
      Sexe: req.body.Sexe,
      Telephone: req.body.Telephone,
      Email: req.body.Email,
      Password: hashedPassword,
      Photo: req.body.Photo,
      Codevalidator: confirmationcode,
    };

    const client = await Client.create(propriete);
    const mailOptions = {
      from: 'garagetahinalisoa@gmail.com',
      to: req.body.Email,
      subject: 'Code de validation de compte',
      text: `Bonjour cher client merci de s'inscrire veuillez confirmer votre compte avec ce code : ${confirmationcode}` 
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if(error){
        console.error(error);
        res.send('Il y a une erreur sur l/envoie de mail');
      } else {
        res.send({ statut:true, msg: 'Email envoyer' });
      }
    })
    res.status(200).send(client);
    console.log(client);
  } catch (error) {
    console.error(error);
    res.status(500).send("Une erreur s'est produite lors de l'ajout du client.");
  }
};
//Envoyer SMS
const SMS = async (req, res) => {
  const { destinataire } = req.body;

  const admin = await Admin.findOne();

  izaho.messages
    .create({
      body: admin.Password,
      from: '+16183684641', // Remplacez par votre numéro de téléphone Twilio
      to: destinataire
    })
    .then(message => {
      console.log('Message envoyé avec succès');
      res.send({ statut:true,message:'Le mot de passe a été envoyer' });
    })
    .catch(error => {
      console.error('Erreur lors de l\'envoi du message:', error);
      res.send({statut:false,message:'Le numéro n`est pas le votre' });
    });
}

// Vérification de code de confirmation
const verification = async (req, res) => {
  const {Email, confirmationcode } = req.body;

  try {
  const client = await Client.findOne({ where: { Email: Email, Codevalidator: confirmationcode} });

  if(!client) {
    return res.send({ statut: false, message: 'Code de confirmation incorect'});
  }

  client.Validation=true;
  
  await client.save();


  const token = jwt.sign({ userId: client.id}, secretKey);
  return res.json({ token: token, statut:true  });
  }catch (error) {
  console.error('Erreur lors de vérificatio de confirmation', error);
  return res.status(500).json({message: 'Une erreur lors de vérification de code'})
}
}

//Mot de passe oublié de le mandefa email
const mdpcode = async (req, res) => {
  const confirmationcode2 = rondom2();
  const email = req.body.Email;

  const mailOptions = {
    from: 'garagetahinalisoa@gmail.com',
    to: email,
    subject: 'Code de mot de passe oublier',
    text: `Voici le code : ${confirmationcode2}` 
  }

transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      console.error(error);
      res.send({ statut:false, msg: 'Email non envoyer' });
    } else {
      res.send({ statut:true, msg: 'Email envoyer', code: confirmationcode2 });
    }
  })
}

// 2. Prendre tous les clients
const getAllClients = async (req, res) => {
  let clients = await Client.findAll({})
  res.status(200).send(clients)
}

// 3. Prendre un seul clients
const getOneClient = async (req, res) => {
  let id = req.params.id
  let client = await Client.findOne({ where: { id: id }})
  res.status(200).send(client)
}

// 4. Mis à jour client

const updateClient = async (req, res) => {
  let id = req.params.id
  const client = await Client.update(req.body, { where: { id: id }})
  res.status(200).send(client)
}

// 5. Supprimer client par ID

const deleteClient = async (req, res) => {
  let id = req.params.id
  await Client.destroy({ where: { id: id }} )
  res.status(200).send('Le cient est supprimé !')
}


module.exports = {
  addClient,
  getAllClients,
  getOneClient,
  updateClient,
  deleteClient,
  login,
  verification,
  logout,
  SMS,
  mdpcode,
}