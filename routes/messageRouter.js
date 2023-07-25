const messageController = require('../controllers/messageController.js')

const router = require('express').Router()



router.get('/listermessage', messageController.listermessage)

router.get('/listermessage2', messageController.listermessage2)

router.delete('/deletemessage2', messageController.deletemessage)



module.exports = router