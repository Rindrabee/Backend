const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

var corOptions = {
    origin: 'http://localhost:5173'
}


//middleware

app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static("sary"));

// routers
const routerclt = require('./routes/clientRouter.js')
const routeradm = require('./routes/adminRouter.js')
const routergarage = require('./routes/garageRouter.js')
const routerpassword = require('./routes/passwordRouter.js')
    
app.use('/api/clients', routerclt) 
app.use('/api/admins', routeradm) 
app.use('/api/garages', routergarage)
app.use('/api/password', routerpassword)
// app.use(express.static('sary'));
// testing api

app.get('/',(req, res) => {
    res.json({ message: 'hello from api' })
})

// port 
const PORT = process.env.PORT || 8082

//server
app.listen(PORT, () => {
    console.log(`server is runningon port ${PORT}`) 
})