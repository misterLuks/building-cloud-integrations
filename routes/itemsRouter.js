module.exports = function(passport, data){
    let router = require('express').Router()
    const multer = require('multer')
    const upload = multer({ dest: 'images/' }).array('images', 4)
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const { v4: uuidv4 } = require('uuid');




    //Initialize JSON Validator
    const itemSchema = require('../schemas/item.schema.json')
    const itemValidator = ajv.compile(itemSchema)

    //passport.authenticate('jwt', {session: false}),
    router.get('/',  (req, res) => {
        res.send(data.items.filter(item => {
            if (req.query.location != undefined) {
                if (item.location != req.query.location) {
                    return false;
                }
            }
            if (req.query.date != undefined) {
                if (item.date != req.query.date) {
                    return false;
                }
            }
            if (req.query.category != undefined) {
                if (item.category != req.query.category) {
                    return false;
                }
            }
            return true
        }))
    })

    //
    router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
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
                const validationResult = itemValidator(req.body)
                if(validationResult) {
                    const itemId = uuidv4()
                    data.items.push({
                        itemId : itemId,
                        title : req.body.title,
                        description : req.body.description,
                        category : req.body.category,
                        location : req.body.location,
                        images : req.files,
                        dateOfPosting : Date.now(),
                        askingPrice : req.body.askingPrice,
                        deliveryType : req.body.deliveryType,
                        senderName : req.body.senderName,
                        senderEmail : req.body.senderEmail, 
                    })
                    res.json({itemId : itemId})
                } else {
                    res.status(400)
                    res.send("Input invalid")
                }
            }
        })
     })

    router.get('/:itemId', (req, res) => {
        let index = data.items.findIndex(item => item.itemId === req.params.itemId)
        if (index !== -1) {
            const requestedData = data.items[index]
            res.json(requestedData)
        } else {
            res.sendStatus(404)
        }
        
    })

    router.put('/:itemId', passport.authenticate('jwt', {session: false}),  (req, res) => {
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(400)
                res.send("Too many files uploaded");
            } else if (err) {
                res.sendStatus(400)
                // An unknown error occurred when uploading. 
            } else {
                const validationResult = itemValidator(req.body)
                if(validationResult) {
                    let index = data.items.findIndex(item => item.itemId === req.params.itemId)
                    if(index !== -1) {
                        let requestedData =  data.items[index]
                        requestedData.title = req.body.title
                        requestedData.description = req.body.description
                        requestedData.category = req.body.category
                        requestedData.location = req.body.location
                        requestedData.images = req.files
                        dateOfPosting : Date.now()
                        requestedData.askingPrice = req.body.askingPrice
                        requestedData.deliveryType = req.body.deliveryType
                        requestedData.senderName = req.body.senderName
                        requestedData.senderEmail = req.body.senderEmail


                        res.json(requestedData)
                    } else {
                        res.sendStatus(404)
                    }
                }
            }
            
        })
    })


    router.delete('/:itemId', passport.authenticate('jwt', {session: false}), (req, res) => {
        let index = data.items.findIndex(item => item.itemId === req.params.itemId)
        if(index !== -1) {
            data['items'].splice(index, 1)
        }
        res.sendStatus(200)
    })

    return router;
}