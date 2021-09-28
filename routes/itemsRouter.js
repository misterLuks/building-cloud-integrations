module.exports = function(passport, data){
    let router = require('express').Router()
    const Ajv = require('ajv')
    const ajv = new Ajv()

    //Initialize JSON Validator
    // const itemSchema = require('../schemas/item.schema.json')
    // const itemValidator = ajv.compile(itemSchema)

    // router.get('/', passport.authenticate('jwt', {session: false}),(req, res) => {
    router.get('/',(req, res) => {
        res.send(data.items.filter(item => {
            if (req.query.location != undefined) {
                if (item.location != req.query.location) {
                    return false;
                }
            }
            if (req.query.date != undefined) {
                if (item.location != req.query.location) {
                    return false;
                }
            }
            if (req.query.category != undefined) {
                if (item.location != req.query.location) {
                    return false;
                }
            }
            return true
        }))
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