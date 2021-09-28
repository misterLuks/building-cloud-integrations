module.exports = function(app, passport, data){
    let router = require('express').Router()
    const Ajv = require('ajv')
    const ajv = new Ajv()

    //Initialize JSON Validator
    // const itemSchema = require('../schemas/item.schema.json')
    // const itemValidator = ajv.compile(itemSchema)

    router.get('/', passport.authenticate('jwt', {session: false}),(req, res) => {
        res.send('hi item')
    })

    router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
        const validationResult = itemValidator(req.body)
        if(validationResult) {
            res.status(200)
            res.send("öaewjföewaj")
        } else {
            res.status(400)
        }
    })

    router.get('/:itemId', (req, res) => {
        res.statusCode(200)
    })

    router.put('/:itemId', passport.authenticate('jwt', {session: false}), (req, res) => {
        res.statusCode(200)
    })

    return router;
}