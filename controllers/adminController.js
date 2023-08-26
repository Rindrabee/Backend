const db = require('../models');
const bcrypt = require('bcrypt');
const secretKey = 'ma_clé_secrète';
const pageclient = require('../models/clientModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomText = require('random-text-generator');
const { any } = require('joi');
const { Op } = require('sequelize');


// create main Model
const Admin = db.admins;
const Urgence = db.urgences;
const Client = db.clients;
const Mecanicien = db.mecaniciens;
const Garage = db.garages;


//Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'garagetahinalisoa@gmail.com',
    clientId: '644760103972-mo2ahkelp1i9i4t8v6655chbsod8tukr.apps.googleusercontent.com',
    clientSecret: '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',
    refreshToken: '1//041rysmsLybaRCgYIARAAGAQSNwF-L9IrDi57Mw8XoA7zMPeVOa5jPvLayX8OLvbcO1dL6JB83nZbYxA5cP58SoYIxu2cOJzBK5E',
    accessToken: 'ya29.a0AfB_byBtYCP1x86lHeixyAhlzh9WbLO5RQ_NirBAyLmpn9H9N3jh2G6vNnazjU34FAgdyY0oQKfJq7svSmzhZlUIpXp5hFOO6xnXjpUnthXkoz0bs10oc9njO1y5CAy2dnIlU30tnBwv6mPAude3JklLlQcG98nd6EsgkQaCgYKAVUSARISFQHsvYlsOh1H8r7x0owI-_Zk5xvJIQ0173'
  },
  tls: {
    rejectUnauthorized: false
  }
});


const login = async (req, res) => {
    try {
      const email = req.body.Email;
      const password = req.body.Password;
  
      const admin = await Admin.findOne({ where: { Email: email }});

      if (!admin) {
        return res.send({ status:false,message:'Vérifier bien votre email' });
      }

      const pass = await Admin.findOne({ where: { Password: password }});
      if (!pass) {
        return res.send({ status:false,message:'Vérifier bien votre mot de passe' });
      }
     
      const token = jwt.sign({ adminId: admin.id }, secretKey, { expiresIn: '1h' });
  
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

// PRENDRE LE SESSION AVEC TOKEN
const session = async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];

    const decodedtoken = jwt.verify(token, secretKey);

    const adm = await Admin.findByPk(decodedtoken.adminId);

    if(!adm) {
      return res.status(401).json({message: 'Aucun trouvé'});
    }
    return res.json({adm: adm});


  } catch(error) {
    return res.json({message: 'Token pas trouvé'});
  }
};

// Mise à jour Admin
const updateAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      return res.status(404).send("Client not found");
    }

    admin.Nom = req.body.Nom;
    admin.Prenoms = req.body.Prenoms;
    admin.Naissance = req.body.Naissance;
    admin.Email = req.body.Email;
    admin.Password = req.body.Password;


    await admin.save();

    res.status(200).send(admin);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// 2. Prendre tous les administrateurs
const getAllAdmin = async (req, res) => {
  let admins = await Admin.findAll({})
  res.status(200).send(admins)
}


// Lister tous les urgences
const getAllurgence = async (req, res) => {
  let urgences = await Urgence.findAll({})
  res.status(200).send(urgences)
}


// Prendre le detail de l'urgence
const detailurgence = async (req, res) => {
  let id = req.params.id
  let urgence = await Urgence.findOne({ where: { id: id }})
  res.status(200).send(urgence)
}


// 3. Prendre profil client
const profilclient = async (req, res) => {
  let id = req.params.id
  let client = await Client.findOne({ where: { id: id }})
  res.status(200).send(client)
}

// 3. Prendre profil mecanicien
const profilmecanicien = async (req, res) => {
  let id = req.params.id
  let mecanicien = await Mecanicien.findOne({ where: { id: id }})
  res.status(200).send(mecanicien)
}

//4. Prendre profil garages
const profilegarage = async (req, res) => {
  let id = req.params.id
  let garage = await Garage.findOne({ where: { id: id }})
  res.status(200).send(garage)
}

const redirectToGarage = async (req, res) => {
  let idGarage = req.body.idGarage;
  let idUrgence = req.body.idUrgence;

  let  urgences = await Urgence.findByPk(idUrgence)

  urgences.id_garage = idGarage;
  urgences.Etat = 2; // 2 garage
  
  await urgences.save();

  return res.status(200).send(urgences);

};


// envoyer vers le mecanicien
const redirectToMecanicien = async (req, res) => {
  let idMecanicien = req.body.idMecanicien;
  let idUrgence = req.body.idUrgence;


  let  urgences = await Urgence.findByPk(idUrgence)
  
  let mecaniciens = await Mecanicien.findByPk(idMecanicien)

  mecaniciens.id_urgence = idUrgence;

  await mecaniciens.save();

  urgences.id_mecanicien = idMecanicien;
  urgences.Etat = 3; // 3 Mecanicien
  
  await urgences.save();

  return res.status(200).send(urgences);

};

// Supprimer urgences


const deleteurgence = async (req, res) => {
  let id = req.params.id
  const client = await Urgence.findByPk(id);

  if (!client) {
    return res.status(404).send("Client not found");
  }

  const mailOptions = {
    from: 'garagetahinalisoa@gmail.com',
    to: client.Email,
    subject: 'Excuse',
    text: `Désolé car nous ne pouvons pas vous rejoindre, vraiment désolé.` 
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      console.error(error);
      res.send('Il y a une erreur sur l/envoie de mail');
    } else {
      res.send({ statut:true, msg: 'Email envoyer' });
    }
  })


  await Urgence.destroy({ where: { id: id }} )
  res.status(200).send('Urgence supprimé !')


}


// urgence terminer
const deleteurgence1 = async (req, res) => {
  let id = req.params.id
  await Urgence.destroy({ where: { id: id }} )
  res.status(200).send('Le urgence est supprimé !')

}

// Garage pas disponible
const garagepasdispo = async (req, res) => {
  try {
    const id = req.params.id;
    const urgence = await Urgence.findByPk(id);

    if (!urgence) {
      return res.status(404).send("Urgence not found");
    }

    const mailOptions = {
      from: 'garagetahinalisoa@gmail.com',
      to: 'tahinalisoanirina@gmail.com',
      subject: 'Lettre d`excuse',
      text: `Bonjour, nous avons bien reçu votre transfert d'urgence mais nous sommes vraiment désolé car nous sommes très occupé aujourd'hui` 
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        console.error(error);
        res.send('Il y a une erreur sur l/envoie de mail');
      } else {
        res.send({ statut:true, msg: 'Email envoyer' });
      }
    })
    
    urgence.Etat = null;
    urgence.id_garage = null;
   
    await urgence.save();

    res.status(200).send(urgence);

    } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
}

}


// Mécanicien pas disponible
const mecapasdispo = async (req, res) => {
  try {
    const id = req.params.id;
    const urgence = await Urgence.findByPk(id);

    if (!urgence) {
      return res.status(404).send("Urgence not found");
    }

    // Récupérer l'ID du garage associé à l'urgence
    const garageId = urgence.id_garage;

    // Rechercher les informations du garage dans la table "garage"
    const garage = await Garage.findByPk(garageId);

    if (!garage) {
      return res.status(404).send("Garage not found");
    }

    // Récupérer l'adresse e-mail du garage
    const garageEmail = garage.Email;

    // Vérifier si l'adresse e-mail du garage est valide
    if (!garageEmail) {
      return res.status(400).send("Garage email not found or invalid");
    }

    const mailOptions = {
      from: 'garagetahinalisoa@gmail.com',
      to: garageEmail, // Utiliser l'adresse e-mail du garage
      subject: 'Lettre d`excuse',
      text: `Bonjour, je ne suis pas disponible pour recevoir cette urgence aujourd'hui`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.send('Il y a une erreur sur l/envoi de mail');
      } else {
        // Renvoyer une réponse après avoir envoyé l'e-mail
        
        urgence.Etat = 2;
        urgence.id_mecanicien = null;
        urgence.save().then(() => {
          res.send({ statut: true, msg: 'Email envoyé et urgence sauvegardée' });
        }).catch((err) => {
          console.error(err);
          res.status(500).send("Internal Server Error");
        });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}




module.exports = {
  login,
  logout,
  session,
  getAllAdmin,
  updateAdmin,
  getAllurgence,
  profilclient,
  profilmecanicien,
  profilegarage,
  detailurgence,
  redirectToGarage,
  redirectToMecanicien,
  deleteurgence,
  deleteurgence1,
  garagepasdispo,
  mecapasdispo
}