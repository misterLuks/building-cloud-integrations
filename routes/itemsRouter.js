module.exports = function(passport, data){
    let router = require('express').Router()
    const multer = require('multer')
    const upload = multer({ dest: 'images/' }).array('images', 4)
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const { v4: uuidv4 } = require('uuid');




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

    
    //  passport.authenticate('jwt', {session: false}),
    router.post('/', (req, res) => {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(400)
                res.send("Too many files uploaded")
            } else if (err) {
                res.sendStatus(400)
                // An unknown error occurred when uploading. 
            } else {
                // Everything went fine.
                const itemId = uuidv4()
                data['items'].push({
                id : itemId,
                title : req.body.title,
                description : req.body.description,
                category : req.body.category,
                location : req.body.location,
                images : req.files,
                askingPrice : req.body.askingPrice,
                deliveryType : req.body.deliveryType,
                contactInfo : {
                    senderName : req.body.name,
                    senderEmail : req.body.email, 
                }
            })
            res.json({itemId : itemId})
            }
        })
        

    })

    router.get('/:itemId', (req, res) => {
        let index = data['items'].findIndex(item => item.id === req.params.itemId)
        if (index !== -1) {
            const requestedData = data.items[index]
            res.json(requestedData)
        } else {
            res.sendStatus(404)
        }
        
    })

    //passport.authenticate('jwt', {session: false}),
    router.put('/:itemId',  (req, res) => {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(400)
                res.send("Too many files uploaded");
            } else if (err) {
                res.sendStatus(400)
                // An unknown error occurred when uploading. 
            } else {
                let index = data['items'].findIndex(item => item.id === req.params.itemId)
                if(index !== -1) {
                    let requestedData =  data.items[index]
                    console.log(data.items[index])
                    console.log("BODY")
                    console.log(req.body)

                    requestedData.title = req.body.title
                    requestedData.description = req.body.description
                    requestedData.category = req.body.category
                    requestedData.location = req.body.location
                    requestedData.images = req.files
                    requestedData.askingPrice = req.body.askingPrice
                    requestedData.deliveryType = req.body.deliveryType
                    requestedData.contactInfo.senderName = req.body.senderName
                    requestedData.contactInfo.senderEmail = req.body.email


                    res.json(requestedData)
                } else {
                    res.sendStatus(404)
                }
            }
            
        })
    })

    //passport.authenticate('jwt', {session: false}),
    router.delete('/:itemId', (req, res) => {
        let index = data['items'].findIndex(item => item.id === req.params.itemId)
        if(index !== -1) {
            data['items'].splice(index, 1)
        }
        res.sendStatus(200)
    })

    return router;
}