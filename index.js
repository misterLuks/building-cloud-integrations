const express =  require('express')
const app = express()
const passport = require('passport')


// Set up global data state
var data = require('./data')

// Setup passport
require('./authentication').setup(passport, data)

// json parsing middleware (bodyparser is deprecated)
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

// Import routes
let usersRoutes = require('./routes/usersRouter')(passport, data)
let itemsRoutes = require('./routes/itemsRouter')(passport, data)

// use imported routes
app.use('/users', usersRoutes)
app.use('/items', itemsRoutes)


const port = 3000
// launch app
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
