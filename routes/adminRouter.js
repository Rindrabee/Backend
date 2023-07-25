const adminController = require('../controllers/adminController.js')

const router = require('express').Router()

router.post('/loginadmin', adminController.login)

router.post('/logoutadmin', adminController.logout)

router.get('/getAllAdmin', adminController.getAllAdmin)

router.get('/session', adminController.session)

router.get('/getAllurgence', adminController.getAllurgence)

router.get('/profilclient/:id', adminController.profilclient)

router.get('/profilmecanicien/:id', adminController.profilmecanicien)

router.get('/profilegarage/:id', adminController.profilegarage)

router.get('/detailurgence/:id', adminController.detailurgence)



router.put('/updateAdmin/:id', adminController.updateAdmin)

router.post('/redirectToGarage', adminController.redirectToGarage)

router.post('/redirectToMecanicien', adminController.redirectToMecanicien)

router.delete('/supprimerurgence/:id', adminController.deleteurgence)




module.exports = router