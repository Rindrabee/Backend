const db = require('../models');
const bcrypt = require('bcrypt');
const secretKey = 'ma_clé_secrète';
const pageclient = require('../models/clientModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomText = require('random-text-generator');




// create main Model
const Client = db.clients;

//Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'garagetahinalisoa@gmail.com',
    clientId: '644760103972-mo2ahkelp1i9i4t8v6655chbsod8tukr.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04f4LjDvpjoHeCgYIARAAGAQSNwF-L9IrDkz5ZzcFQ9mbFertwcY7CaHTHmCFUCD1Y5u76vY8ALfwLeuw_spcU6PLh6TKWrmkBV8',
    accessToken: 'ya29.a0AWY7CkldeMxFe-4Sr08bLmbr6eNXN__Kr_T8zefnDPgw_IFOojEN7QZICN23saek5MReE_IJ-6vAqGwZ3GOKWrIVuHktoFJWKTHeby7EjYTS_8s67SbTx6ixfHInsk5DlcwnxAiEhA4EKLWFUPg4WHLLbt96aCgYKAQ0SARISFQG1tDrp22X-CznKUbZOvOO3tbLmhQ0163'
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

// main work

//login 

const login = async (req, res) => {
  try {
    const email = req.body.Email;
    const password = req.body.Password;

    const client = await Client.findOne({ where: { Email: email } });
    if (!client) {
      return res.send({ status:false,message:'Vérifier bien votre email' });
    }

    const passwordMatch = await bcrypt.compare(password, client.Password);
    if (!passwordMatch) {
      return res.send({ status:false,message:'Vérifier bien votre mot de passe' });
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
  try {
    const token = req.headers.authorization.split(' ')[1]; // Récupérer le jeton depuis l'en-tête Authorization

    // Supprimer le jeton d'authentification de la base de données
    await TokenModel.findOneAndDelete({ token });

    res.json({ status: true, message: "Déconnexion réussie" });
  } catch (error) {
    console.error(error);
    res.send("Une erreur s'est produite lors de la déconnexion.");
  }
};


const addClient = async (req, res) => {
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
      subject: 'Voila votre code de confirmation',
      text: `Voila votre code : ${confirmationcode}` 
    }
    transporter.sendMail(mailOptions, (error, info) => {
      if(error){
        console.error(error);
        res.send('Il y a une erreur sur l/envoie de mail');
      }else{
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
}