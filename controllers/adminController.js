const db = require('../models');
const pageadmin = require('../models/adminModel');
const jwt = require('jsonwebtoken');

// create main Model
const Admin = db.admins;


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
     
      const token = jwt.sign({ adminId: admin.id }, 'secret_key', { expiresIn: '1h' });
  
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

module.exports = {
    login,
    logout
}