const db = require('../models');
const bcrypt = require('bcrypt');
const secretKey = 'ma_clé_secrète';
const pagegarage = require('../models/garageModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomText = require('random-text-generator');
const { any } = require('joi');


// create main Model
const Garage = db.garages;
const Voiture = db.voitures;


//Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'garagetahinalisoa@gmail.com',
      clientId: '644760103972-mo2ahkelp1i9i4t8v6655chbsod8tukr.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//04ukP6eJRigWpCgYIARAAGAQSNwF-L9IrfxMlSTlaJxLlwMfhx_NR8NOJhPGmZ7wnSw9i7MaKGDmERbfuHod_h8cWV-TvilQxBzU',
      accessToken: 'ya29.a0AbVbY6PC-fL4NcouJxvz-nQGEMWJS1hWxo2T0YZFx_yFrrOx2p2DXYauUSNusmFvy_Uao7gsFfFRLBCz5HgKCg5VQaFzvgRX9HjZFRAkQ8FroCWuf9aISkXp4vKFyK5yCJz_8JpqgMNvyCRc1_BdpaLDhCc3aCgYKAckSARISFQFWKvPl5XYjHkLFq0QJKDWGpmZqiw0163'
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
  
      const garage = await Garage.findOne({ where: { Email: email }});
      if (!garage) {
        return res.send({ status:false,message:'Vérifier bien votre email' });
      }
  
      const passwordMatch = await bcrypt.compare(password, garage.Password);
      if (!passwordMatch) {
        return res.send({ status:false,message:'Vérifier bien votre mot de passe' });
      }
      
    //   if (garage.Etat != 1) {
    //     return res.send({ status:false,message:'Veuillez patientez'});
    //   }
     
      const token = jwt.sign({ garageId: garage.id }, secretKey , { expiresIn: '1h' });
  
      res.json({ status:true,token:token });
      
      
    } catch (error) {
      console.error(error);
      res.send("Une erreur s'est produite lors de la connexion.");
    }
};

// Ajouter garage

const addGarage = async (req, res) => {

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
        Adresse: req.body.Adresse,
        Latitude: req.body.Latitude,
        Longitude: req.body.Longitude,
        Telephone: req.body.Telephone,
        Email: req.body.Email,
        Specialite: req.body.Specialite,
        Heures_ouverture: req.body.Heures_ouverture,
        Heures_fermeture: req.body.Heures_fermeture,
        service_offerte: req.body.service_offerte,
        equipement: req.body.equipement,
        Password: hashedPassword,
        Photo: filename,
      };
  
      const garage = await Garage.create(propriete);
      const mailOptions = {
        from: 'garagetahinalisoa@gmail.com',
        to: req.body.Email,
        subject: 'Bienvenue et attente de confirmation',
        text: `Cher/Chère [Nom de l'inscrit(e)],

        Bienvenue dans notre communauté ! Nous sommes ravis de vous accueillir parmi nous. Suite à votre entretien, nous tenions à vous informer que nous devons encore attendre la confirmation de l'administrateur avant de finaliser votre inscription.
        
        Nous avons été impressionnés par votre profil et votre intérêt pour [mentionner le domaine/pôle d'activité]. Nous sommes actuellement en attente de la décision de l'administrateur, qui examinera votre entretien attentivement. Nous vous prions de patienter quelques jours supplémentaires jusqu'à ce que nous puissions vous fournir une réponse définitive.
        
        Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à [adresse e-mail de contact]. Nous sommes là pour vous aider.
        
        Nous vous remercions encore une fois pour votre intérêt et votre candidature. Nous sommes impatients de vous accueillir officiellement dans notre communauté.
        
        Cordialement,` 
      }
  
      transporter.sendMail(mailOptions, (error, info) => {
        if(error){
          console.error(error);
          res.send('Il y a une erreur sur l/envoie de mail');
        } else {
          res.send({ statut:true, msg: 'Email envoyer' });
        }
      })
      res.status(200).send(garage);
      console.log(garage);
    } catch (error) {
      console.error(error);
      res.status(500).send("Une erreur s'est produite lors de l'ajout du garage.");
    }
};


//Deconnexion
const logout = async (req, res) => {
    res.status(200).json({ message: "Déconnexion réussie." });
   
};



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


// LISTER LES GARAGES AUTO

const listergarage = async (req, res) => {
  try {
    const garages = await Garage.findAll(); 
    res.json(garages);
  } catch(error) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
    console.log(error);
  }
}



// Lister les voitures dans le garage
const listervoiture = async (req, res) => {
  try {
    const voitures = await Voiture.findAll(); 
    res.json(voitures);
  } catch(error) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
    console.log(error);
  }
}

//Ajouter voiture dans le garage

const ajoutvoiture = async (req, res) => {

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
      const propriete = {
        Numero: req.body.Numero,
        Nom: req.body.Nom,
        Date1: req.body.Date1,
        Probleme: req.body.Probleme,
        Idgarage: req.body.Idgarage,
        Photo: filename
      };
  
      const voiture = await Voiture.create(propriete);
    
      res.status(200).send(voiture);
      console.log(voiture);
    } catch (error) {
      console.error(error);
      res.status(500).send("Une erreur s'est produite lors de l'ajout du garage.");
    }
}

// Prendre le sessio du garage connecté

// PRENDRE LE SESSION AVEC TOKEN
const session = async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];

    const decodedtoken = jwt.verify(token, secretKey);

    const grg = await Garage.findByPk(decodedtoken.garageId);

    if(!grg) {
      return res.status(401).json({message: 'Aucun trouvé'});
    }
    
    return res.json({grg: grg});

  } catch(error) {
    return res.json({message: 'Token pas trouvé'});
  }
}



module.exports = {  
   login,
   addGarage,
   logout,
   mdpcode,
   listergarage,
   ajoutvoiture,
   listervoiture,
   session
}