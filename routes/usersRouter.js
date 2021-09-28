

module.exports = function(app, passport, data){
    const bcrypt = require('bcryptjs')
    let router = require('express').Router()
    const secrets = require('../secret.json')

    const Ajv = require('ajv')
    const ajv = new Ajv()

    //Initialize JSON Validator
    const userSchema = require('../schemas/user.schema.json')
    const userValidator = ajv.compile(userSchema)

  

    router.get('/', (req, res) => {
        res.send(data.users)
    })

    //Used for testing purposes
    router.get('/dogs', (req, res) => {
        res.sendStatus(200)
    })


    router.post('/', (req, res) => {
        
        const validationResult = userValidator(req.body)
        if(validationResult) {
            if (data.users.find(user => user.email === req.body.email) != undefined ){
                res.status(400)
                res.send("email already exists in database")
                return
            }
            const salt = bcrypt.genSaltSync(6)
            const hashedPasswd = bcrypt.hashSync(req.body.password, salt)
        
            data.users.push({
                email: req.body.email,
                password: hashedPasswd
            })
            res.send("/users POST").sendStatus(200)
        } else {
            res.send(400)
        }
        
    })

    
    // JWT
    
    const jwt = require('jsonwebtoken')
    const JwtStrategy = require('passport-jwt').Strategy
    const ExtractJwt = require('passport-jwt').ExtractJwt
    
    const options = {
        jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey : secrets.secretCode
    }

    passport.use(new JwtStrategy(options, (payload, done) => {
        done(null, {})
    }))



    router.post('/login', passport.authenticate('basic', {session: false}), (req, res) => {
        const token = jwt.sign({}, secrets.secretCode)
        res.json({token : token})
    })
    

    return router;
}
