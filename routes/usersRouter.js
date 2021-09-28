

module.exports = function(app, passport){
    const bcrypt = require('bcryptjs')
    let router = require('express').Router()


    router.get('/', (req, res) => {
        let data = req.app.get('data')
        res.send(data.items)
    })


    router.post('/', (req, res) => {
        let data = app.get('data')

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
        res.send("/users POST")
    })
    router.post('/login', (req, res) => {
        res.status(200)
    })

    return router;
}
