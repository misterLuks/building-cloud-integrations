const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
chai.use(chaiJsonSchemaAjv)
const server = require('../server');

const serverAddress = "http://localhost:3000"

describe('/users/ API Tests ', function() {
    before(function() {
        //starting the server
        server.start()
    })

    after(function() {
        //ending the server
        server.close()
    })

    //This route is just for testing purposes
    describe('GET /', function() {
        it('should return an array of users', function() {
            chai.request(serverAddress)
            .get('/users/')
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                //done()
            })
        })
    })

    describe('POST /', function() {
        it('should accept item data when data is correct', function() {
            
        })

        it('should reject request with missing field from data structure', function() {

        })

        it('should reject request with incorrect data types', function() {

        })

        it('should reject request with too much data field', function() {

        })

        it('should reject empty post request', function() {

        })

        it('should contain added item data', function() {

        })
    })

    describe('PUT /update', function() {
        it('should update data when data is correct', function() {

        })

        it('should reject data with no token', function() {

        })

        it('should reject data with wrong token', function() {

        })
    })

    describe('DELETE /delete', function() {
        it('should delete the user data', function() {

        })

        it('should reject data with no token', function() {

        })

        it('should reject data with wrong token', function() {

        })
    })

    describe('POST /login', function() {
        it('should login the user with correct login information', function() {

        })

        it('should reject login to user with incorrect login information', function() {

        })

        it('should return a unique token', function() {

        })
    })
})