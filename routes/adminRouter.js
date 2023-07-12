const adminController = require('../controllers/adminController.js')

const router = require('express').Router()

router.post('/loginadmin', adminController.login)

router.post('/logoutadmin', adminController.logout)

router.get('/getAllAdmin', adminController.getAllAdmin)

router.get('/session', adminController.session)



module.exports = router