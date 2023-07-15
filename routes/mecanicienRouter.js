const mecanicienController = require('../controllers/mecanicienController.js')

const router = require('express').Router()

router.post('/loginmecanicien', mecanicienController.login)

router.post('/addMecanicien', mecanicienController.addMecanicien)

router.post('/logout', mecanicienController.logout)

router.post('/mdpcode', mecanicienController.mdpcode)

router.get('/listermecanicien', mecanicienController.listermecanicien)


module.exports = router