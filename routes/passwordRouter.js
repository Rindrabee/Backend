const passwordController = require('../controllers/passwordController.js')

const router = require('express').Router()

router.post('/resetPassword', passwordController.resetPassword);

module.exports = router