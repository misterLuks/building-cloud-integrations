
// 
// Submission of Lucas Aebi and Michael Meier
//

module.exports = function(passport, data){

    // This function creates and returns a router object. 
    // A router is a collection of http routes/endpoints
    // that can be attached to a express app.
    // 
    // The router configured in this function is responsible
    // for all actions regarding items


    let router = require('express').Router()
    const multer = require('multer')
    // const upload = multer({ dest: 'images/' }).array('images', 4)
    const Ajv = require('ajv')
    const ajv = new Ajv()
    const { v4: uuidv4 } = require('uuid');

    var cloudinary = require('cloudinary').v2;
    var { CloudinaryStorage } = require('multer-storage-cloudinary');

    var storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        folder: 'images',
        allowedFormats: ['jpg', 'png']
    })
    const upload = multer({ storage: storage }).array('images', 4)


    //Initialize JSON Validator
    const itemSchema = require('../schemas/item.schema.json')
    const itemValidator = ajv.compile(itemSchema)

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
                        userId: req.user.userId,
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

                        // make sure the user is the creator of this item
                        if (requestedData.userId != req.user.userId){
                            res.sendStatus(401)
                        } else {
                            requestedData.title = req.body.title
                            requestedData.description = req.body.description
                            requestedData.category = req.body.category
                            requestedData.location = req.body.location
                            requestedData.images = req.files
                            requestedData.dateOfPosting = Date.now()
                            requestedData.askingPrice = req.body.askingPrice
                            requestedData.deliveryType = req.body.deliveryType
                            requestedData.senderName = req.body.senderName
                            requestedData.senderEmail = req.body.senderEmail


                            res.json(requestedData)
                        }
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
            if (data.items[index].userId === req.user.userId) {
                data.items.splice(index, 1)
                res.sendStatus(200)
            } else {
                res.sendStatus(401)
            }
        }
    })

    return router;
}