const express = require('express')
const cors = require('cors')
const http = require('http')
const app = express()
const { Server } = require('socket.io')
const server = http.createServer(app)
const Message = require('./models/MessageModel')
const db = require('./models');
app.use(express.static('public'));




const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})

// const app = express()

var corOptions = {
    origin: 'http://localhost:5173'
}

var limit = require('express-limit')

//middleware

app.use(cors(corOptions))

// app.use(express.json())

// app.use(express.urlencoded({ extended: true }))

app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({limit: '50mb',extended: true }))


app.use(express.static("sary"));

// routers
const routerclt = require('./routes/clientRouter.js')
const routeradm = require('./routes/adminRouter.js')
const routergarage = require('./routes/garageRouter.js')
const routermecanicien = require('./routes/mecanicienRouter.js')
const routepass  = require('./routes/passwordRouter.js')
const routepass2  = require('./routes/passwordRouter2.js')
const routepass3  = require('./routes/passwordRouter3.js')
const routemessage  = require('./routes/messageRouter.js')


app.use('/api/clients', routerclt) 
app.use('/api/admins', routeradm) 
app.use('/api/garages', routergarage)
app.use('/api/mecaniciens', routermecanicien)
app.use('/api/password' , routepass)
app.use('/api/password2' , routepass2)
app.use('/api/password3' , routepass3)
app.use('/api/messages' , routemessage)


// MANAO RESAKA SOCKET NA MESSAGE
io.on('connection', (socket) => {
    console.log(`user ${socket.id} is connected`);
  
    // Réception d'un message
    socket.on('chat message', async (data) => {
      console.log('Message received:', data);
  
      try {
        // Création d'une nouvelle entrée dans la table des messages avec Sequelize
        const message = await db.messages.create({
          Text: data.Text,
          id_sender: data.id_sender,
          id_received: data.id_received,
        });
  
        console.log('Message saved to database:', message);
  
        // Envoi du message à tous les utilisateurs connectés
        io.emit('chat message', message);
      } catch (error) {
        console.error('Error saving message to database:', error);
      }
    });
  
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} is left`);
    });
  });






// testing api

app.get('/',(req, res) => {
    res.json({ message: 'hello from api' })
})

// port 
const PORT = process.env.PORT || 8082

//server
server.listen(PORT, () => {
    console.log(`server is runningon port ${PORT}`) 
})