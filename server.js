const express = require('express')
const cors = require('cors')

const app = express()

var corOptions = {
    origin: 'http://localhost:5173'
}


//middleware

app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

// routers
const routerclt = require('./routes/clientRouter.js')
const routeradm = require('./routes/adminRouter.js')
const routergarage = require('./routes/garageRouter.js')
const routermecanicien = require('./routes/mecanicienRouter.js')
const routepass  = require('./routes/passwordRouter.js')
const routepass2  = require('./routes/passwordRouter2.js')
const routepass3  = require('./routes/passwordRouter3.js')


app.use('/api/clients', routerclt) 
app.use('/api/admins', routeradm) 
app.use('/api/garages', routergarage)
app.use('/api/mecaniciens', routermecanicien)
app.use('/api/password' , routepass)
app.use('/api/password2' , routepass2)
app.use('/api/password3' , routepass3)

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