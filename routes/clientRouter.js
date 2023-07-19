const clientController = require('../controllers/clientController.js')

const router = require('express').Router()

router.post('/addClient', clientController.addClient)

router.post('/ajouterurgence', clientController.ajouterurgence)

router.get('/allClients', clientController.getAllClients)

router.post('/login', clientController.login)

router.post('/logout', clientController.logout)

router.post('/SMS', clientController.SMS)

router.post('/mdpcode', clientController.mdpcode)

router.post('/verificationclt', clientController.verification)

router.get('/session',  clientController.session)



router.get('/getOneClient/:id' ,clientController.getOneClient)

router.put('/updateClient/:id', clientController.updateClient)

router.post('/updateClientPhoto', clientController.updateClientPhoto)

router.delete('/:id', clientController.deleteClient)

module.exports = router
