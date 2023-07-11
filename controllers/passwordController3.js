const bcrypt = require('bcrypt');
const db = require('../models');

const resetPassword = async (req, res) => {
    try {
        const email = req.body.Email;
        const newPassword = req.body.NewPassword;
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        const garage = await db.garages.findOne({ where: { Email: email } });
        
        if (!garage) {
          return res.send({ status:false,message:'Vérifier bien votre email' });
        }
        
        garage.update({ Password: hashedPassword });
        
        res.json({ status:true });
    } catch (error) {
        console.error(error);
        res.send("Une erreur s'est produite lors de la modification du mot de passe.");
    }
};

module.exports = {
    resetPassword
}