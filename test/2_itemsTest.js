const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
chai.use(chaiJsonSchemaAjv)
const fs = require('fs');

const server = require('../server');
//const serverAddress = "http://localhost:3000"
const serverAddress = "https://cloud-integrations-api.herokuapp.com"

const itemsArraySchema = require('../schemas/itemsArray.schema.json')
const itemSchema = require('../schemas/item.schema.json')

let token = null
let itemId = null

describe('/items/ API Tests ', function() {
    before(function(done) {
        //starting the server
        server.start()
        console.log("Server starting...")

        //Create user
        chai.request(serverAddress)
        .post('/users')
        .send({
            username: "test",
            email: "test1@gmail.com",
            password: "test123"
        }).end()
        
        //Log the user in and save the token for later usage
        chai.request(serverAddress)
        .post('/users/login')
        .auth("test1@gmail.com", "test123")
        .end(function(err, res) {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            token = res.body.token
            expect(token).to.not.be.null
            done()
        })
    })

    after(function(done) {
        //ending the server
        server.close()
        done()
    })

    describe('POST /',function() {
        it('should accept item data when data is correct', function(done) {
            chai.request(serverAddress)
            .post('/items')
            .set({ "Authorization": `Bearer ${token}` })
            .send({
                title: "Coffee mug",
                description: "A coffee mug to drink coffee or tea in the morning",
                category: "Kitchen utilities",
                location: "Oulu, FI",
                askingPrice: 50,
                deliveryType: "Shipping",
                senderName: "Herjuno",
                senderEmail: "foo@bar.com"
            }).end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                done()
            }) 
            
        })

        it('should reject request with missing field from data structure', function(done) {
            chai.request(serverAddress)
            .post('/items')
            .set({ "Authorization": `Bearer ${token}` })
            .send({
                title: "Coffee ",
                description: "Just plain coffee ",
                category: "Food",
                location: "Oulu, FI",
                askingPrice: 200,
                deliveryType: "Shipping",
                senderName: "Herjuno"
            }).end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(400)
                done()
            }) 
        })

        it('should reject request with incorrect data types', function(done) {
            chai.request(serverAddress)
            .post('/items')
            .set({ "Authorization": `Bearer ${token}` })
            .send({
                title: "Tea",
                description: "Just plain tea",
                category: "Food",
                location: "Oulu, FI",
                askingPrice: 2,
                deliveryType: "Shipping",
                senderName: "Herjuno",
                senderEmail: 78598012
            }).end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(400)
                done()
            }) 
        })

        it('should reject request with too much data field', function(done) {
            chai.request(serverAddress)
            .post('/items')
            .set({ "Authorization": `Bearer ${token}` })
            .send({
                title: "Chicken nugget",
                description: "yummy",
                category: "Food",
                location: "Oulu, FI",
                askingPrice: 25,
                deliveryType: "Shipping",
                senderName: "Herjuno",
                senderEmail: "foo@bar.com",
                senderStatus: "Single"
            }).end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(400)
                done()
            }) 
        })

        it('should reject empty post request', function(done) {
            chai.request(serverAddress)
            .post('/items')
            .set({ "Authorization": `Bearer ${token}` })
            .send({})
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(400)
                done()
            }) 
        })

        /*
        it('should reject more than 4 images', function(done) {
            chai.request(serverAddress)
            .post('/items')
            .set({ "Authorization": `Bearer ${token}` })
            //.type('form')
            .field('title', 'Chicken nugget')
            .field('description', 'yummy')
            .field('category', 'Food')
            .field('location', 'Oulu')
            .field('askingPrice', 25)
            .field('deliveryType', "Delivery")
            .field('senderName', "John")
            .field('senderEmail', "John@test.com")
            //.attach('images', './test/image1.png', 'test.png')
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                done()
            })

        })
        */
        

    })

    describe('GET /', function() {
        it('should return an array of item object', function(done) {
            chai.request(serverAddress)
            .get('/items/')
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.jsonSchema(itemsArraySchema)
                done()
            })
        })

        it('should filter objet based on query parameter', function(done) {
            
            //Adding data to the list to be checked later
            chai.request(serverAddress)
            .post('/items')
            .set({ "Authorization": `Bearer ${token}` })
            .send({
                title: "Coffee ",
                description: "Just plain coffee",
                category: "Food",
                location: "Oulu, FI",
                askingPrice: 25,
                deliveryType: "Shipping",
                senderName: "Herjuno",
                senderEmail: "foo@bar.com"
            }).end()

            //Still adding data
            chai.request(serverAddress)
            .post('/items')
            .set({ "Authorization": `Bearer ${token}` })
            .send({
                title: "Tea ",
                description: "Just plain tea",
                category: "Food",
                location: "Oulu, FI",
                askingPrice: 25,
                deliveryType: "Shipping",
                senderName: "Herjuno",
                senderEmail: "foo@bar.com"
            }).end()
            
            chai.request(serverAddress)
            .get('/items/')
            .query({category: "Food"})
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.jsonSchema(itemsArraySchema)
                expect(res.body).to.have.lengthOf(2);
                //ItemId to be used for the next routes
                itemId = res.body[0].itemId
                done()
            })
        })


    })
    describe('GET /:itemId', function() {
        it('should return an item object', function(done) {
            chai.request(serverAddress)
            .get(`/items/${itemId}`)
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.jsonSchema(itemSchema)
                done()
            })
        })
        it('should reject data with wrong itemId', function(done){
            chai.request(serverAddress)
            .get('/items/12345678')
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(404)
                done()
            })
        })
    
    })
    
    describe('PUT /:itemId', function() {
        
        
        it('should update data when data is correct', function(done) {
            
            chai.request(serverAddress)
            .put(`/items/${itemId}`)
            .set({ "Authorization": `Bearer ${token}` })
            .send({
                title: "Chicken nugget",
                description: "yummy",
                category: "Food",
                location: "Oulu, FI",
                askingPrice: 25,
                deliveryType: "Shipping",
                senderName: "Herjuno",
                senderEmail: "foo@bar.com"
            }).end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
            }) 
            
            chai.request(serverAddress)
            .get(`/items/${itemId}`)
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.jsonSchema(itemSchema)
                expect(res.body.title).to.equal("Chicken nugget")
                done()
            })
        })
    
        it('should reject data with wrong itemId', function(done) {
            chai.request(serverAddress)
            .put("/items/123456")
            .set({ "Authorization": `Bearer ${token}` })
            .send({
                title: "Chicken nugget",
                description: "yummy",
                category: "Food",
                location: "Oulu, FI",
                askingPrice: 25,
                deliveryType: "Shipping",
                senderName: "Herjuno",
                senderEmail: "foo@bar.com"
            }).end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(404)
                done()
            }) 
        })
    })
    
    describe('DELETE /:itemId', function() {
        it('should delete data when itemId is correct', function(done) {
            chai.request(serverAddress)
            .delete(`/items/${itemId}`)
            .set({ "Authorization": `Bearer ${token}` })
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
            }) 
            
            chai.request(serverAddress)
            .get(`/items/${itemId}`)
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(404)
                done()
            })
        })

        it('should reject data with no token', function(done) {
            chai.request(serverAddress)
                .delete(`/items/${itemId}`)
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    done()
                })

        })

        it('should reject data with wrong token', function(done) {
            chai.request(serverAddress)
            .delete("/items/12345")
            .set({ "Authorization": `Bearer qeafoajef` })
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(401)
                done()
            }) 
        })
    })
})


