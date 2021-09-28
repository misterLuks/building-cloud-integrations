module.exports = function(app, passport){
    let router = require('express').Router()

    router.get('/', passport.authenticate('basic', {session: false}),(req, res) => {
        res.send('hi item')
    })

    router.post('/', passport.authenticate('basic', {session: false}), (req, res) => {
        res.status(200)
        res.send("öaewjföewaj")
    })

    router.get('/:itemId', (req, res) => {
        res.statusCode(200)
    })

    router.put('/:itemId', passport.authenticate('basic', {session: false}), (req, res) => {
        res.statusCode(200)
    })

    return router;
}