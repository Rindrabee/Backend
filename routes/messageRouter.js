const messageController = require('../controllers/messageController.js')

const router = require('express').Router()



router.get('/listermessage', messageController.listermessage)

router.get('/listermessage2', messageController.listermessage2)

router.get('/listermessage3', messageController.listermessage3)

router.delete('/deletemessage2', messageController.deletemessage)

router.delete('/deletemessage3', messageController.deletemessage3)



module.exports = router