const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
chai.use(chaiJsonSchemaAjv)

const server = require('../server');
const serverAddress = "http://localhost:3000"


describe('/items/ API Tests ', function() {
    before(function() {
        //starting the server
        server.start()
    })

    after(function() {
        //ending the server
        server.close()
    })



    describe('GET /', function() {
        it('should return an array of item object', function() {

        })

        it('should filter objet based on filter', function() {

        })


    })

    describe('POST /',function() {
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

        it('should reject request with more than four images', function() {

        })

    })

    describe('GET /:itemId', function() {
        it('should return an item object', function() {

        })
        it('should reject data with wrong itemId')

    })

    describe('PUT /:itemId', function() {
        it('should update data when data is correct', function() {

        })

        it('should reject data with wrong itemId', function() {

        })
    })

    describe('DELETE /:itemId', function() {
        it('should delete data when itemId is correct', function() {

        })
        it('should reject data with wrong itemId', function() {

        })
    })
})