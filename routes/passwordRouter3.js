const passwordController3 = require('../controllers/passwordController3.js')

const router = require('express').Router()

router.post('/resetPassword', passwordController3.resetPassword);

module.exports = router