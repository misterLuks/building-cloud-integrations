const express =  require('express')
const app = express()
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs')
const multer = require('multer')
const upload = multer({ dest: 'imagesTest/' })




// Set up global data state
var data = require('./data')

// Set up passport
passport.use(new BasicStrategy(
    (email, password, done) => {
        const searchResult = data["users"].find(
            user => {
                if (user.email === email){
                    if (bcrypt.compareSync(password, user.password)){
                        return true
                    } else {
                        return false
                    }
                }
            }
        )
        if (searchResult != undefined){
            done(null, searchResult)
        } else {
            done(null, false)
        }
    }
))

app.post('/test', upload.array('images', 4), (req, res) => {
    console.log(req.files )
    res.sendStatus(200)
})

// json parsing middleware (bodyparser is deprecated)
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

// Import routes
let usersRoutes = require('./routes/usersRouter')(app, passport, data)
let itemsRoutes = require('./routes/itemsRouter')(app, passport, data)

// use imported routes
app.use('/users', usersRoutes)
app.use('/items', itemsRoutes)


const port = 3000
// launch app
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
