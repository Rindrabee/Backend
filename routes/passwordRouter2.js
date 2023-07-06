const passwordController2 = require('../controllers/passwordController2.js')

const router = require('express').Router()

router.post('/resetPassword', passwordController2.resetPassword);

module.exports = router