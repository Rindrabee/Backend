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
const router = require('./routes/clientRouter.js')
app.use('/api/clients', router) 


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