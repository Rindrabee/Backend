const garageController = require('../controllers/garageController.js')

const router = require('express').Router()

router.post('/logingarage', garageController.login)

router.post('/addGarage', garageController.addGarage)

router.post('/logout', garageController.logout)

router.post('/mdpcode', garageController.mdpcode)

router.get('/listergarage', garageController.listergarage)

router.post('/ajoutvoiture', garageController.ajoutvoiture)

router.get('/listervoiture', garageController.listervoiture)


router.get('/session', garageController.session)

router.get('/countGarages', garageController.countGarages)

router.get('/countVoiture', garageController.countVoiture)

router.put('/updateGarage/:id', garageController.updateGarage)

router.put('/acceptergarage/:id', garageController.acceptergarage)

router.put('/bloquergarage/:id', garageController.bloquergarage)

router.put('/deletegarage/:id', garageController.deletegarage)


module.exports = router