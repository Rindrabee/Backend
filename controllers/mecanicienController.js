const db = require('../models');
const bcrypt = require('bcrypt');
const secretKey = 'ma_clé_secrète';
const pagegarage = require('../models/garageModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomText = require('random-text-generator');
const { any } = require('joi');


// create main Model
const Mecanicien = db.mecaniciens;

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
  
      const mecanicien = await Mecanicien.findOne({ where: { Email: email }});
      if (!mecanicien) {
        return res.send({ status:false,message:'Vérifier bien votre email' });
      }
  
      const passwordMatch = await bcrypt.compare(password, mecanicien.Password);
      if (!passwordMatch) {
        return res.send({ status:false,message:'Vérifier bien votre mot de passe' });
      }
      
    //   if (mecanicien.Etat != 1) {
    //     return res.send({ status:false,message:'Vous êtes pas encore approuvé'});
    //   }
     
      const token = jwt.sign({ mecanicienId: mecanicien.id }, 'secret_key', { expiresIn: '1h' });
  
      res.json({ status:true,token:token });
      
      
    } catch (error) {
      console.error(error);
      res.send("Une erreur s'est produite lors de la connexion.");
    }
};



// Ajouter mecanicien

const addMecanicien = async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.Password, 10);
      const confirmationcode = rondom();
  
      const propriete = {
        Nom: req.body.Nom,
        Prenoms: req.body.Prenoms,
        Naissance: req.body.Naissance,
        Sexe: req.body.Sexe,
        Telephone: req.body.Telephone,
        Specialite: req.body.Specialite,
        Email: req.body.Email,
        Experience: req.body.Experience,
        certification: req.body.certification,
        langue_parle: req.body.langue_parle,
        Password: hashedPassword,
        Photo: req.body.Photo,
      };
  
      const mecanicien = await Mecanicien.create(propriete);
      const mailOptions = {
        from: 'garagetahinalisoa@gmail.com',
        to: req.body.Email,
        subject: 'Bienvenue et attente de confirmation',
        text: `Cher/Chère [Nom de l'inscrit(e)],

        Nous vous félicitons pour votre inscription réussie à notre communauté ! Nous sommes impatients de vous accueillir officiellement parmi nous. Nous souhaitons vous informer que votre profil a été sélectionné et nous avons le plaisir de vous convier à un entretien.
        
        Votre entretien est prévu pour le [date] à [heure]. Veuillez vous assurer d'être disponible à cette date et à cette heure. L'entretien se déroulera à [lieu]. Nous vous recommandons d'arriver en avance pour vous permettre de vous installer confortablement.
        
        Nous apprécions grandement votre intérêt pour le domaine de la mécanique et nous sommes impatients d'en apprendre davantage sur vos compétences et vos expériences lors de l'entretien.
        
        Si vous avez des questions ou des préoccupations avant l'entretien, n'hésitez pas à nous contacter à [adresse e-mail de contact]. Nous sommes là pour vous aider et vous fournir toutes les informations dont vous pourriez avoir besoin.
        
        Encore une fois, nous vous remercions pour votre intérêt et votre candidature. Nous avons hâte de vous rencontrer lors de l'entretien et de discuter de votre possible intégration au sein de notre communauté.
        
        Cordialement,
        [Votre nom]
        [Votre titre/poste]
        [Nom de l'entreprise/organisation]` 
      }
  
      transporter.sendMail(mailOptions, (error, info) => {
        if(error){
          console.error(error);
          res.send('Il y a une erreur sur l/envoie de mail');
        } else {
          res.send({ statut:true, msg: 'Email envoyer' });
        }
      })
      res.status(200).send(mecanicien);
      console.log(mecanicien);
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
    addMecanicien,
    logout,
    mdpcode,
}