const db = require('../models');
const bcrypt = require('bcrypt');
const secretKey = 'ma_clé_secrète';
const pageclient = require('../models/clientModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomText = require('random-text-generator');
const { any } = require('joi');



// TAm za nitesta message tam phone
const accountSid = 'AC84dd8c6a73f41515d2d6238dcc981f0f'; 
const authToken = 'bb2bc3cfca6f93d4f0381db301a85b8c'; 
const izaho = require('twilio')(accountSid, authToken);


// create main Model
const Client = db.clients;
const Admin = db.admins;
const Urgence = db.urgences;

//Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'garagetahinalisoa@gmail.com',
    clientId: '644760103972-mo2ahkelp1i9i4t8v6655chbsod8tukr.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//04gJSg8jYYPDaCgYIARAAGAQSNwF-L9IrT1xI-Oi_lNS6pNKj7GTwKAgsa3gA4zNrjy7Nz13qlpPo0VfWOU8gy5SzJRVnJ87DHPk',
    accessToken: 'ya29.a0AbVbY6MI0KkDKxVctveFjtgvNyHAXIklSIagGRDubzYZVCuN2shGkRMydOyHrThmbKya3lYI27uDWYctX5bRxXE0u4yZpUNIVa54Gb3cQg_Uab0ygIlEizmEIpXrrTGZmXqq1hecru5FZ5rgOT9-3cqrCaCpaCgYKATASARISFQFWKvPl3ZNqGCT8PTYN4n0GsDivDA0163'
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

    if(client.Etat == 1) {
      return res.send({ status:false,message:'Vous êtes bloquer'});
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


//Ajouter un nouveau client

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


//Ajouter un nouveau client

const ajouterurgence = async (req, res) => {

  try {
    const propriete = {
      Nom: req.body.name,
      Email: req.body.email,
      Telephone: req.body.phone,
      Adresse: req.body.address,
      Probleme: req.body.Probleme,
      Latitude: req.body.latitude,
      Longitude: req.body.longitude,
    };

    const urgence = await Urgence.create(propriete);
    const mailOptions = {
      from: 'garagetahinalisoa@gmail.com',
      to: req.body.email,
      subject: 'URGENCE',
      text: `Bonjour on a bien reçu votre demande d'urgence et nous cherchons maintenat à trouver une garage près de votre 
      localisation et, ensuite eux vous contacte sur le site en envoyant une mécanicien` 
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        console.error(error);
        res.send('Il y a une erreur sur l/envoie de mail');
      } else {
        res.send({ statut:true, msg: 'Email envoyer' });
      }
    })
    res.status(200).send(urgence);
    console.log(urgence);
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
      body: "Voici votre mot de passe Mr : "  + admin.Password,
      from: '+15312344463', // Remplacez par votre numéro de téléphone Twilio
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


// Compter les clients inscrits

const countClients = async (req, res) => {
  try {
    const clientCount = await Client.count();
    res.status(200).send({ count: clientCount });
  } catch (error) {
    res.status(500).send({ error: "Une erreur s'est produite lors du comptage des clients." });
  }
};

// Compter les urgences

const counturgence = async (req, res) => {
  try {
    const urgenceCount = await Urgence.count();
    res.status(200).send({ count: urgenceCount });
  } catch (error) {
    res.status(500).send({ error: "Une erreur s'est produite lors du comptage des urgences." });
  }
};

// 3. Prendre un seul clients
const getOneClient = async (req, res) => {
  let id = req.params.id
  let client = await Client.findOne({ where: { id: id }})
  res.status(200).send(client)
}

// 4. Mis à jour client

const updateClient = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).send("Client not found");
    }

    client.Nom = req.body.Nom;
    client.Prenoms = req.body.Prenoms;
    client.Naissance = req.body.Naissance;
    client.Profession = req.body.Profession;
    client.Adresse = req.body.Adresse;
    client.Sexe = req.body.Sexe;
    client.Telephone = req.body.Telephone;
    client.Email = req.body.Email;

    if (req.body.Photo) {
      // Faites l'enregistrement de l'image ici
      const uuid = require('uuid');
      const fs = require('fs');
      const mime = require('mime-types');
      const filename = `${uuid.v4()}`;
      const base64 = req.body.Photo;
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const filePath = `public/${filename}`;

      const mimeType = base64.split(';')[0].split(':')[1];
      const fileExtension = mime.extension(mimeType);

      if (fileExtension) {
        const newFilePath = `${filePath}.${fileExtension}`;
        fs.writeFile(newFilePath, buffer, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("L'image a été enregistrée avec succès !");
            client.Photo = filename;
            client.save(); // Sauvegarder le client avec la nouvelle image dans la base de données
          }
        });
      } else {
        console.log("Impossible de détecter le type de fichier de l'image.");
      }
    }

    await client.save();

    res.status(200).send(client);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};


// update seulement le photo
const updateClientPhoto = async (req, res) => {

}

// Accepter client 
const accepterclient = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).send("Client not found");
    }
    
    client.Etat = null;
    
   
    await client.save();

    res.status(200).send(client);

    } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
}
}

// Bloquer client 
const bloquerclient = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).send("Client not found");
    }
    
    client.Etat = 1;
    
   
    await client.save();

    res.status(200).send(client);

    } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
}
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
  session,
  ajouterurgence,
  updateClientPhoto,
  accepterclient,
  bloquerclient,
  countClients,
  counturgence
}