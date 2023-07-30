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

router.put('/acceptmec/:id', garageController.acceptmec)

router.put('/reffusermec/:id', garageController.reffusermec)


router.put('/acceptcli/:id', garageController.acceptcli)

router.put('/reffusercli/:id', garageController.reffusercli)


router.put('/bloquerclient/:id', garageController.bloquerclient)


router.put('/bloquergarage/:id', garageController.bloquergarage)

router.put('/bloquermec/:id', garageController.bloquermec)

router.put('/deletegarage/:id', garageController.deletegarage)

router.get('/getAllUrgenceGarage', garageController.getAllUrgenceGarage)


router.put('/terminervoiture/:id', garageController.terminervoiture)


router.put('/supprimervoiture/:id', garageController.supprimervoiture)


router.get('/countRendezvousForConnectedGarage/:idGarage', garageController.countRendezvousForConnectedGarage)


router.get('/nombredesmecaniciens/:idGarage', garageController.nombredesmecaniciens)


router.get('/nombredesclients/:idGarage', garageController.nombredesclients)


router.get('/nombredesvoiture/:idGarage', garageController.nombredesvoiture)


router.get('/nombreurgence/:idGarage', garageController.nombreurgence)


router.get('/searchGarageByName/:Nom', garageController.searchGarageByName)



module.exports = router