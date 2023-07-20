const messageController = require('../controllers/messageController.js')

const router = require('express').Router()



router.get('/listermessage', messageController.listermessage)



module.exports = router