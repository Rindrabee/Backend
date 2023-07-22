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
  
      const mecanicien = await Mecanicien.findOne({ where: { Email: email }});
      if (!mecanicien) {
        return res.send({ status:false,message:'Vérifier bien votre email' });
      }
  
      const passwordMatch = await bcrypt.compare(password, mecanicien.Password);
      if (!passwordMatch) {
        return res.send({ status:false,message:'Vérifier bien votre mot de passe' });
      }
      
      if (mecanicien.Etat != 1) {
        return res.send({ status:false,message:'Veuillez patienter votre demande est en cours de traitement'});
      }
     
      const token = jwt.sign({ mecanicienId: mecanicien.id }, secretKey, { expiresIn: '1h' });
  
      res.json({ status:true,token:token });
      
      
    } catch (error) {
      console.error(error);
      res.send("Une erreur s'est produite lors de la connexion.");
    }
};



// Ajouter mecanicien

const addMecanicien = async (req, res) => {
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
        Adresse: req.body.Adresse,
        Sexe: req.body.Sexe,
        Telephone: req.body.Telephone,
        Specialite: req.body.Specialite,
        Email: req.body.Email,
        Experience: req.body.Experience,
        certification: req.body.certification,
        langue_parle: req.body.langue_parle,
        Password: hashedPassword,
        Photo: filename,
      };
  
      const mecanicien = await Mecanicien.create(propriete);
      const mailOptions = {
        from: 'garagetahinalisoa@gmail.com',
        to: req.body.Email,
        subject: 'Bienvenue et attente de confirmation',
        text: `Cher/Chère `+req.body.Nom+`,

        Nous vous félicitons pour votre inscription réussie à notre communauté ! Nous sommes impatients de vous accueillir officiellement parmi nous. Nous souhaitons vous informer que votre profil a été sélectionné et nous avons le plaisir de vous convier à un entretien.
        
        Votre entretien est prévu pour le [date] à [heure]. Veuillez vous assurer d'être disponible à cette date et à cette heure. L'entretien se déroulera à [lieu]. Nous vous recommandons d'arriver en avance pour vous permettre de vous installer confortablement.
        
        Nous apprécions grandement votre intérêt pour le domaine de la mécanique et nous sommes impatients d'en apprendre davantage sur vos compétences et vos expériences lors de l'entretien.
        
        Si vous avez des questions ou des préoccupations avant l'entretien, n'hésitez pas à nous contacter à [adresse e-mail de contact]. Nous sommes là pour vous aider et vous fournir toutes les informations dont vous pourriez avoir besoin.
        
        Encore une fois, nous vous remercions pour votre intérêt et votre candidature. Nous avons hâte de vous rencontrer lors de l'entretien et de discuter de votre possible intégration au sein de notre communauté.
        
        Cordialement,` 
      }
  
      transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
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

// LISTER LES MECANICIENS

const listermecanicien = async (req, res) => {
  try {
    const mecaniciens = await Mecanicien.findAll(); 
    res.json(mecaniciens);
  } catch(error) {
    res.status(500).json({ error: 'Erreur lors de la récupération' });
    console.log(error);
  }
}

// Compter les mecaniciens inscrits

const countMecaniciens = async (req, res) => {
  try {
    const mecanicienCount = await Mecanicien.count();
    res.status(200).send({ count: mecanicienCount });
  } catch (error) {
    res.status(500).send({ error: "Une erreur s'est produite lors du comptage des garages." });
  }
};




// Prendre le session du mécanicien
const session = async (req, res) => {
  try {
  const token = req.headers['authorization'].split(' ')[1];

  const decodedtoken = jwt.verify(token, secretKey);

  const mc = await Mecanicien.findByPk(decodedtoken.mecanicienId);

  if(!mc) {
    return res.status(401).json({message: 'Aucun trouvé'});
  }
  return res.json({mc: mc});

  } catch(error) {
    return res.json({message: 'Token pas trouvé'});
  }
}


//Modification mecanicien

const updateMecanicien = async (req, res) => {
  try {
    const id = req.params.id;
    const mecanicien = await Mecanicien.findByPk(id);

    if (!mecanicien) {
      return res.status(404).send("Mecanicien not found");
    }

    mecanicien.Nom = req.body.Nom;
    mecanicien.Prenoms = req.body.Prenoms;
    mecanicien.Naissance = req.body.Naissance;
    mecanicien.Adresse = req.body.Adresse;
    mecanicien.Telephone = req.body.Telephone;
    mecanicien.Specialite = req.body.Specialite;
    mecanicien.Email = req.body.Email;
    mecanicien.Experience = req.body.Experience;
    mecanicien.certification = req.body.certification;
    mecanicien.langue_parle = req.body.langue_parle;
  


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
            mecanicien.Photo = filename;
            mecanicien.save(); // Sauvegarder le client avec la nouvelle image dans la base de données
          }
        });
      } else {
        console.log("Impossible de détecter le type de fichier de l'image.");
      }
    }

    await mecanicien.save();

    res.status(200).send(mecanicien);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};



// Accepter mecanicien
const acceptermecanicien = async (req, res) => {
  try {
    const id = req.params.id;
    const mecanicien = await Mecanicien.findByPk(id);

    if (!mecanicien) {
      return res.status(404).send("Mecanicien not found");
    }
    
    mecanicien.Etat = 1;
    
   
    await mecanicien.save();

    res.status(200).send(mecanicien);

    } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
}
}

// Bloquer mecanicien
const bloquermecanicien = async (req, res) => {
  try {
    const id = req.params.id;
    const mecanicien = await Mecanicien.findByPk(id);

    if (!mecanicien) {
      return res.status(404).send("Mecanicien not found");
    }
    
  mecanicien.Etat = null;
    
   
  await mecanicien.save();

  res.status(200).send(mecanicien);

  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}

}

// 5. Supprimer mecanicien par ID

const deletemecanicien = async (req, res) => {
  let id = req.params.id
  await Mecanicien.destroy({ where: { id: id }} )
  res.status(200).send('Le mecanicien est supprimé !')

}
  

module.exports = {  
  login,
  addMecanicien,
  logout,
  mdpcode,
  listermecanicien,
  session,
  updateMecanicien,
  acceptermecanicien,
  bloquermecanicien,
  deletemecanicien,
  countMecaniciens
}