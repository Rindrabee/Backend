const rendezController = require('../controllers/rendezController.js')

const router = require('express').Router()


router.post('/ajouterrendez', rendezController.ajouterrendez)

router.get('/listerrendezvous', rendezController.listerrendezvous)


module.exports = router