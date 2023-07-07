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
     
      const token = jwt.sign({ garageId: garage.id }, 'secret_key', { expiresIn: '1h' });
  
      res.json({ status:true,token:token });
      
      
    } catch (error) {
      console.error(error);
      res.send("Une erreur s'est produite lors de la connexion.");
    }
};

// Ajouter garage

const addGarage = async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.Password, 10);
      const confirmationcode = rondom();
  
      const propriete = {
        Nom: req.body.Nom,
        Adresse: req.body.Adresse,
        Telephone: req.body.Telephone,
        Email: req.body.Email,
        Specialite: req.body.Specialite,
        Heures_ouverture: req.body.Heures_ouverture,
        Heures_fermeture: req.body.Heures_fermeture,
        service_offerte: req.body.service_offerte,
        equipement: req.body.equipement,
        Password: hashedPassword,
        Photo: req.body.Photo,
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
  


module.exports = {  
   login,
   addGarage,
   logout,
   mdpcode
}