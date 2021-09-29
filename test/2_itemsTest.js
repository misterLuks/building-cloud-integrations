const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
chai.use(chaiJsonSchemaAjv)

const server = require('../server');
const serverAddress = "http://localhost:3000"

const itemsArraySchema = require('../schemas/itemsArray.schema.json')

let token = null

describe('/items/ API Tests ', function() {
    before(function(done) {
        //starting the server
        server.start()
        console.log("Server starting...")


        chai.request(serverAddress)
        .post('/users')
        .send({
            username: "test",
            email: "test@gmail.com",
            password: "test123"
        }).end()
        
        chai.request(serverAddress)
        .post('/users/login')
        .auth("test@gmail.com", "test123")
        .end(function(err, res) {
            expect(res).to.have.status(200)
            token = res.body.token
            console.log("token")
            console.log(token)
        })
        done()
        

    })

    after(function() {
        //ending the server
        server.close()
    })

    describe('POST /',function() {
        it('should accept item data when data is correct', function(done) {
            chai.request(serverAddress)
            .post('/items')
            .auth(token, {type : 'bearer' })
            .send({
                title: "Coffee mug",
                description: "A coffee mug to drink coffee or tea in the morning",
                category: "Kitchen utilities",
                location: "Oulu, FI",
                askingPrice: "25",
                deliveryType: "Shipping",
                senderName: "Herjuno",
                senderEmail: "foo@bar.com"
            }).end(function(err, res) {
                expect(res).to.have.status(200)
                done()
            }) 
            
        })

        it('should reject request with missing field from data structure', function(done) {
            done()
        })

        it('should reject request with incorrect data types', function(done) {
            done()
        })

        it('should reject request with too much data field', function(done) {
            done()
        })

        it('should reject empty post request', function(done) {
            done()
        })

        it('should contain added item data', function(done) {
            done()
        })

        it('should reject request with more than four images', function(done) {
            done()
        })

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
            chai.request(serverAddress)
            .get('/items/')
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.jsonSchema(itemsArraySchema)
                expect(res.body)
                done()
            })
        })


    })

    

    describe('GET /:itemId', function() {
        it('should return an item object', function(done) {
            done()
        })
        it('should reject data with wrong itemId', function(done){
            done()
        })

    })

    describe('PUT /:itemId', function() {
        it('should update data when data is correct', function(done) {
            done()
        })

        it('should reject data with wrong itemId', function(done) {
            done()
        })
    })

    describe('DELETE /:itemId', function() {
        it('should delete data when itemId is correct', function(done) {
            done()
        })
        it('should reject data with wrong itemId', function(done) {
            done()
        })
    })
})