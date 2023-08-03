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
    refreshToken: '1//04RuOA6VJ9jMdCgYIARAAGAQSNwF-L9IrwyjgGKomd6D-oMiAQHv0M8UHGoX_v0vaklahObTmhV6yvXya7IjqLtjb_eY5y6mR3kE',
    accessToken: 'ya29.a0AfB_byBBuiIQ_h0W2QTHo2T5a0jBb32PJ4magUwfPlFKDv4xLFN7roKPDqrSQT-Waja84sfDWY1FkXotbC7E-UKDnLSFe7cnJMBGaKXHZX9RWi4-EUJNQGwj-gptmebzJgrkAFFbFQd6c7B4aZZHpJLJW2haaCgYKAWASARISFQHsvYlsTHSSAX2mvYhlbCv49f1xTA0163'
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
  deleteurgence1
}