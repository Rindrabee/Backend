const clientController = require('../controllers/clientController.js')

const router = require('express').Router()

router.post('/addClient', clientController.addClient)

router.post('/ajouterurgence', clientController.ajouterurgence)

router.get('/allClients', clientController.getAllClients)

router.get('/searchClientByName/:Nom', clientController.searchClientByName)

router.post('/login', clientController.login)

router.post('/logout', clientController.logout)

router.post('/SMS', clientController.SMS)

router.post('/mdpcode', clientController.mdpcode)

router.post('/verificationclt', clientController.verification)

router.get('/session',  clientController.session)





router.put('/inscriregarage/:id', clientController.inscriregarage)

router.get('/getOneClient/:id' ,clientController.getOneClient)

router.put('/updateClient/:id', clientController.updateClient)

router.put('/accepterclient/:id', clientController.accepterclient)

router.put('/bloquerclient/:id', clientController.bloquerclient)

router.delete('/:id', clientController.deleteClient)

router.get('/countClients', clientController.countClients)

router.get('/counturgence', clientController.counturgence)

module.exports = router
