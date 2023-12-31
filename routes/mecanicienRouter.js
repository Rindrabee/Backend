const mecanicienController = require('../controllers/mecanicienController.js')

const router = require('express').Router()

router.post('/loginmecanicien', mecanicienController.login)

router.post('/addMecanicien', mecanicienController.addMecanicien)

router.post('/logout', mecanicienController.logout)

router.post('/mdpcode', mecanicienController.mdpcode)

router.get('/listermecanicien', mecanicienController.listermecanicien)

router.get('/session', mecanicienController.session)

router.get('/countMecaniciens', mecanicienController.countMecaniciens)


router.get('/searchMecanicienByName/:Nom', mecanicienController.searchMecanicienByName)




router.put('/updateMecanicien/:id', mecanicienController.updateMecanicien)

router.put('/acceptermecanicien/:id', mecanicienController.acceptermecanicien)

router.put('/ajouterpoint/:id', mecanicienController.ajouterpoint)

router.put('/diminuerpoint/:id', mecanicienController.diminuerpoint)

router.put('/inscriregarage/:id', mecanicienController.inscriregarage)

router.put('/bloquermecanicien/:id', mecanicienController.bloquermecanicien)

router.put('/deletemecanicien/:id', mecanicienController.deletemecanicien)

router.put('/supprimeidurgence', mecanicienController.supprimeidurgence)








module.exports = router