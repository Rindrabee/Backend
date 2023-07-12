const db = require('../models');
const bcrypt = require('bcrypt');
const secretKey = 'ma_clé_secrète';
const pageclient = require('../models/clientModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomText = require('random-text-generator');
const { any } = require('joi');



// TAm za nitesta message tam phone
const accountSid = 'AC879991023407a8c08481b1b16012e216'; 
const authToken = '06b28c387e0f01dbc59445645dc9c43b'; 
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
    refreshToken: '1//04OFs1sGz5T9eCgYIARAAGAQSNwF-L9IrG6UHYtDAIuXoOrEGs2gGJKCr7B67hDKQEgyB2R6saniWyvKR-Eb5s4sWJWme8i9E0o0',
    accessToken: 'ya29.a0AbVbY6PQmF7bsJn2lthi4ooDXLOSSdDEsU380X2xpwJcz69Mw9PqBorSdEJ9m7mlmKO2EomCEpJVXzokLpj_3TCu4MqfUdXAHTgNuf86vM3XiMqicCP0B8CVDsG9EwnTcjpWBi7ch6vVilbiQCN8WG8S21xOaCgYKARASARISFQFWKvPlcaPPhdb4U-k-wXyHN22z9Q0163'
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
   
    const token = jwt.sign({ clientId: client.id }, secretKey, { expiresIn: '1h' });

    res.json({ status:true,token:token });
    
    
  } catch (error) {
    console.error(error);
    res.send("Une erreur s'est produite lors de la connexion.");
  }
};

// PRENDRE LE SESSION AVEC TOKEN
const session = async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];

    const decodedtoken = jwt.verify(token, secretKey);

    const clt = await Client.findByPk(decodedtoken.clientId);

    if(!clt) {
      return res.status(401).json({message: 'Aucun trouvé'});
    }
    return res.json({clt: clt});

  } catch(error) {
    return res.json({message: 'Token pas trouvé'});
  }
};


// Deconnexion
const logout = async (req, res) => {
  res.status(200).json({ message: "Déconnexion réussie." });
 
};

const addClient = async (req, res) => {

  const uuid = require('uuid');
  const fs = require('fs');
  const mime = require('mime-types');
  
  // Generate a random filename using UUID
  const filename = `${uuid.v4()}`;
  
  const base64 = req.body.Photo;
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, 'base64');
  
  const filePath = `public/${filename}`;
  
  (async () => {
    try {
      const mimeType = base64.split(';')[0].split(':')[1];
      const fileExtension = mime.extension(mimeType);
  
      if (fileExtension) {
        const newFilePath = `${filePath}.${fileExtension}`;
        fs.writeFile(newFilePath, buffer, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("L'image a été enregistrée avec succès !");
          }
        });
      } else {
        console.log("Impossible de détecter le type de fichier de l'image.");
      }
    } catch (err) {
      console.log(err);
    }
  })();
  
  
 
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
      Photo: filename,
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
      if(error) {
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
      from: '+15734902946', // Remplacez par votre numéro de téléphone Twilio
      to: destinataire
    })
    .then(message => {
      console.log('Message envoyé avec succès');
      res.send({ statut:true,message:'Mot de passe envoyer avec succès sur votre numéro' });
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
  session
}