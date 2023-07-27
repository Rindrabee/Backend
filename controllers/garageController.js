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
const Urgence = db.urgences;
const Mecanicien = db.mecaniciens;
const Client = db.clients;
const Rendezvous = db.rendezvous;

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
  
      const garage = await Garage.findOne({ where: { Email: email }});
      if (!garage) {
        return res.send({ status:false,message:'Vérifier bien votre email' });
      }
  
      const passwordMatch = await bcrypt.compare(password, garage.Password);
      if (!passwordMatch) {
        return res.send({ status:false,message:'Vérifier bien votre mot de passe' });
      }
      
      if (garage.Etat != 1) {
        return res.send({ status:false,message:'Veuillez patienter votre demande est en cours de traitement'});
      }
     
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
        text: `Cher/Chère `+ req.body.Nom +`,

        Bienvenue dans notre communauté ! Nous sommes ravis de vous accueillir parmi nous. Suite à votre entretien, nous tenions à vous informer que nous devons encore attendre la confirmation de l'administrateur avant de finaliser votre inscription.
        
        Nous avons été impressionnés par votre profil. Nous sommes actuellement en attente de la décision de l'administrateur, qui examinera votre entretien attentivement. Nous vous prions de patienter quelques jours supplémentaires jusqu'à ce que nous puissions vous fournir une réponse définitive.
        
        Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter à 0341790551. Nous sommes là pour vous aider.
        
        Nous vous remercions encore une fois pour votre intérêt et votre candidature. Nous sommes impatients de vous accueillir officiellement dans notre communauté.
        
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

// Compter les garages inscrits

const countGarages = async (req, res) => {
  try {
    const garageCount = await Garage.count();
    res.status(200).send({ count: garageCount });
  } catch (error) {
    res.status(500).send({ error: "Une erreur s'est produite lors du comptage des garages." });
  }
};


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

// Compter les voitures ajouter

const countVoiture = async (req, res) => {
  try {
    const voitureCount = await Voiture.count();
    res.status(200).send({ count: voitureCount });
  } catch (error) {
    res.status(500).send({ error: "Une erreur s'est produite lors du comptage des voitures." });
  }
};


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

//Modification garage

const updateGarage = async (req, res) => {
  try {
    const id = req.params.id;
    const garage = await Garage.findByPk(id);

    if (!garage) {
      return res.status(404).send("Mecanicien not found");
    }

    garage.Nom = req.body.Nom;
    garage.Adresse = req.body.Adresse;
    garage.Latitude = req.body.Latitude;
    garage.Longitude = req.body.Longitude;
    garage.Telephone = req.body.Telephone;
    garage.Email = req.body.Email;
    garage.Specialite = req.body.Specialite;
    garage.Heures_ouverture = req.body.Heures_ouverture;
    garage.Heures_fermeture = req.body.Heures_fermeture;
    garage.equipement = req.body.equipement;
    garage.service_offerte = req.body.service_offerte;
   


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
            garage.Photo = filename;
            garage.save(); // Sauvegarder le client avec la nouvelle image dans la base de données
          }
        });
      } else {
        console.log("Impossible de détecter le type de fichier de l'image.");
      }
    }

  await garage.save();

  res.status(200).send(garage);
  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
  }
};


// Accepter garage
const acceptergarage = async (req, res) => {
  try {
    const id = req.params.id;
    const garage = await Garage.findByPk(id);

    if (!garage) {
      return res.status(404).send("Garage not found");
    }

    const mailOptions = {
      from: 'garagetahinalisoa@gmail.com',
      to: garage.Email,
      subject: 'Bienvenue',
      text: `Bonjour, nous avons bien reçu votre demande d'adhésion sur notre site web, et nous vous félicitons pour avoir été accepté(e).` 
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        console.error(error);
        res.send('Il y a une erreur sur l/envoie de mail');
      } else {
        res.send({ statut:true, msg: 'Email envoyer' });
      }
    })
    
    garage.Etat = 1;
    
   
    await garage.save();

    res.status(200).send(garage);

    } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
}
}

// Bloquer garage
const bloquergarage = async (req, res) => {
  try {
    const id = req.params.id;
    const garage = await Garage.findByPk(id);

    if (!garage) {
      return res.status(404).send("Garage not found");
    }
    
    garage.Etat = null;
    
   
  await garage.save();

  res.status(200).send(garage);

  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}

}


// Accepter mécanicien
const acceptmec = async (req, res) => {
  try {
    const id = req.params.id;
    const mecanicien = await Mecanicien.findByPk(id);

    if (!mecanicien) {
      return res.status(404).send("Mecanicien not found");
    }
    
    const mailOptions = {
      from: 'garagetahinalisoa@gmail.com',
      to: mecanicien.Email,
      subject: 'Bienvenue',
      text: `Bonjour, nous avons bien reçu votre demande d'adhésion, et nous vous félicitons pour avoir été accepté(e).` 
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) {
        console.error(error);
        res.send('Il y a une erreur sur l/envoie de mail');
      } else {
        res.send({ statut:true, msg: 'Email envoyer' });
      }
    })
    
    mecanicien.Etat2 = 1;
    
   
  await mecanicien.save();

  res.status(200).send(mecanicien);

  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}

}
// Reffuser  mécanicien
const reffusermec = async (req, res) => {
  try {
    const id = req.params.id;
    const mecanicien = await Mecanicien.findByPk(id);

    if (!mecanicien) {
      return res.status(404).send("Mecanicien not found");
    }
    
    mecanicien.id_garage = null;
    
   
  await mecanicien.save();

  res.status(200).send(mecanicien);

  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}

}

// bloquer mécanicien
const bloquermec = async (req, res) => {
  try {
    const id = req.params.id;
    const mecanicien = await Mecanicien.findByPk(id);

  if (!mecanicien) {
    return res.status(404).send("Mecanicien not found");
  }
    
  mecanicien.Etat2 = null;
    
   
  await mecanicien.save();

  res.status(200).send(mecanicien);

  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}

}


// Accepter client
const acceptcli = async (req, res) => {
  try {
    const id = req.params.id;
    const client = await Client.findByPk(id);

  if (!client) {
    return res.status(404).send("Client not found");
  }

  const mailOptions = {
    from: 'garagetahinalisoa@gmail.com',
    to: client.Email,
    subject: 'Bienvenue',
    text: `Bonjour, nous avons bien reçu votre demande d'adhésion, et nous vous félicitons pour avoir été accepté(e).` 
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      console.error(error);
      res.send('Il y a une erreur sur l/envoie de mail');
    } else {
      res.send({ statut:true, msg: 'Email envoyer' });
    }
  })
    
  client.Etat2 = 1;
    
   
  await client.save();

  res.status(200).send(client);

  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}

}

// Reffuser client
const reffusercli = async (req, res) => {
  try {
  const id = req.params.id;
  const client = await Client.findByPk(id);

  if (!client) {
    return res.status(404).send("Client not found");
  }
    
  client.id_garage = null;
    
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
    
  client.Etat2 = null;
    
  await client.save();

  res.status(200).send(client);

  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}

}

// Terminer un voiture

const terminervoiture = async (req, res) => {
  try {
  const id = req.params.id;
  const voiture = await Voiture.findByPk(id);

  if (!voiture) {
    return res.status(404).send("Voiture not found");
  }
    
  voiture.Etat = 1;
    
  await voiture.save();

  res.status(200).send(voiture);

  } catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}

}

// Supprimer voiture
const supprimervoiture = async (req, res) => {
  let id = req.params.id
  await Voiture.destroy({ where: { id: id }} )
  res.status(200).send('Voiture est supprimé !')

}


// 5. Supprimer garage par ID

const deletegarage = async (req, res) => {
  let id = req.params.id
  await Garage.destroy({ where: { id: id }} )
  res.status(200).send('Le garage est supprimé !')

}

const getAllUrgenceGarage = async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];
  const decodedtoken = jwt.verify(token, secretKey);
  
  conditions = {
    'id_garage': decodedtoken.garageId,
    'Etat': 2
  };
  
  let urgences = await Urgence.findAll({
    where: conditions
  });
  
  res.status(200).send(urgences);
}

// Compter les liste de rendez-vous.
const countRendezvousForConnectedGarage = async (req, res) => {
  const idGarage = req.params.idGarage;

  try {
    const rendezvousCount = await Rendezvous.count({
      where: { id_garage: idGarage }
    });

    res.status(200).send({ grg: { id: idGarage }, rendezvouscompte: rendezvousCount });
  } catch (error) {
    res.status(500).send({ error: "Une erreur s'est produite lors du comptage des rendez-vous." });
  }
};



// Compter les listes des mecaniciens dans une garage
const nombredesmecaniciens = async (req, res) => {
  const idGarage = req.params.idGarage;

  try {
    const garagecount = await Mecanicien.count({
      where: { id_garage: idGarage }
    });

    res.status(200).send({ grg: { id: idGarage }, mecaniciens: garagecount });
  } catch (error) {
    res.status(500).send({ error: "Une erreur s'est produite lors du comptage des mecaniciens." });
  }
};

// Compter les listes des clients dans le garage

const nombredesclients = async (req, res) => {
  const idGarage = req.params.idGarage;

  try {
    const clientscount = await Client.count({
      where: { id_garage: idGarage }
    });

    res.status(200).send({ grg: { id: idGarage }, client: clientscount });
  } catch (error) {
    res.status(500).send({ error: "Une erreur s'est produite lors du comptage des clients." });
  }
};

// Compter les listes des voitures dans le garage
const nombredesvoiture = async (req, res) => {
  const idGarage = req.params.idGarage;

  try {
    const voitureCount = await Voiture.count({
    where: { Idgarage : idGarage }
    });

    res.status(200).send({ grg: { id: idGarage }, voiture: voitureCount });
  } catch (error) {
    res.status(500).send({ error: "Une erreur s'est produite lors du comptage des voitures." });
  }
};

// Liste des rendez-vous dans le garages
const nombreurgence = async (req, res) => {
  const idGarage = req.params.idGarage;

  try {
    const urgencecount = await Urgence.count({
      where: { id_garage: idGarage }
  });

  res.status(200).send({ grg: { id: idGarage }, urgence: urgencecount });
  } catch (error) {
    res.status(500).send({ error: "Une erreur s'est produite lors du comptage des urgences." });
  }
};



module.exports = {  
  login,
  addGarage,
  logout,
  mdpcode,
  listergarage,
  ajoutvoiture,
  listervoiture,
  session,
  updateGarage,
  acceptergarage,
  bloquergarage,
  deletegarage,
  countGarages,
  countVoiture,
  getAllUrgenceGarage,
  acceptmec,
  reffusermec,
  bloquermec,
  acceptcli,
  reffusercli,
  bloquerclient,
  terminervoiture,
  supprimervoiture,
  countRendezvousForConnectedGarage,
  nombredesmecaniciens,
  nombredesclients,
  nombredesvoiture,
  nombreurgence
}