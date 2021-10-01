

module.exports = function(passport, data){
    const bcrypt = require('bcryptjs')
    let router = require('express').Router()
    const { v4: uuidv4 } = require('uuid');
    const Ajv = require('ajv')
    const ajv = new Ajv()

    //Initialize JSON Validator
    const userSchema = require('../schemas/user.schema.json')
    const userValidator = ajv.compile(userSchema)

  
    //Should be removed after testing
    router.get('/', (req, res) => {
        res.send(data.users)
    })


    router.post('/', (req, res) => {
        
        const validationResult = userValidator(req.body)
        if(validationResult) {
            if (data.users.find(user => user.email === req.body.email) != undefined ){
                res.status(409)
                res.send("email already exists in database")
                return
            }
            const salt = bcrypt.genSaltSync(6)
            const hashedPasswd = bcrypt.hashSync(req.body.password, salt)
            
            let userId = uuidv4()
        
            data.users.push({
                id: userId,
                email: req.body.email,
                username: req.body.username,
                password: hashedPasswd
            })
            res.send(userId)
        } else {
            res.sendStatus(400)
        }
        
    })

    // Update user information
    router.put('/update', passport.authenticate('jwt', {session: false}), (req, res) => {
        // Validate user object
        const validationResult = userValidator(req.body)
        if (validationResult){
            console.log(req.user.userId)
            let user = data.users.find(user => user.id === req.user.userId)
            if (user === undefined) {
                res.sendStatus(404)
            }
            const salt = bcrypt.genSaltSync(6)
            const hashedPasswd = bcrypt.hashSync(req.body.password, salt)

            user.password = hashedPasswd
            user.username = req.body.username
            user.email = req.body.email

            res.status(200)
            res.send("Ok")
        } else {
            res.status(400)
            res.send("")
        }
    })

    router.delete('/delete',passport.authenticate('jwt', {session: false}), (req, res) => {
        let index = data.users.findIndex(user => user.id === req.user.userId)
        if (index != undefined) {
            data.users.splice(index, 1)
            res.send("user deleted")
        } else {
            res.sendStatus(404)
        }
    })
    


    router.post('/login', passport.authenticate('basic', {session: false}), (req, res) => {
        const token = require('../authentication').sign(req.user.id)
        res.json({token : token})
    })
    

    return router;
}
