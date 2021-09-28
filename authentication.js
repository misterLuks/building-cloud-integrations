const jwt = require('jsonwebtoken')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs')


const secrets = require('./secret.json')
    
const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : secrets.secretCode
}

let sign = (userId) => {
    return jwt.sign({ userId: userId }, secrets.secretCode)
}




let setup = (passport, data) => {
    // setup JWTStragety

    // Users id is awailable in req.user.userI
    passport.use(new JwtStrategy(options, (payload, done) => {
        done(null, {userId: payload.userId})
    }))

    // Set up BasicStrategy
    passport.use(new BasicStrategy(
        (email, password, done) => {
            const user = data["users"].find(
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
            if (user != undefined){
                done(null, user)
            } else {
                done(null, false)
            }
        }
    ))
}

module.exports = {
    setup,
    sign
}