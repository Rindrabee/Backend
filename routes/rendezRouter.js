const rendezController = require('../controllers/rendezController.js')

const router = require('express').Router()


router.post('/ajouterrendez', rendezController.ajouterrendez)

router.get('/listerrendezvous', rendezController.listerrendezvous)

router.put('/accepterrendezvous/:id', rendezController.accepterrendezvous)

router.put('/reffuser/:id', rendezController.reffuser)


module.exports = router