const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const chaiJsonSchemaAjv = require('chai-json-schema-ajv')
chai.use(chaiJsonSchemaAjv)
const server = require('../server');

const serverAddress = "http://localhost:3000"
//const serverAddress = "https://cloud-integrations-api.herokuapp.com"

let token = null

describe('/users/ API Tests ', function() {
    before(function(done) {
        //starting the server
        server.start()
        chai.request(serverAddress) 
        .post('/users')
        .send({
            email: "john.doe@fakemail.com",
            username: "J.D.",
            password: "strongandcomplicatedpassword"
        }).end()
        done()
    })

    after(function(done) {
        //ending the server
        server.close()
        done()
    })

    //This route is just for testing purposes
    describe('GET /', function(done) {
        it('should return an array of users', function(done) {
            chai.request(serverAddress)
            .get('/users/')
            .end(function(err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                done()
            })
        })
    })

    describe('POST /', function() {
        it('should accept item data when data is correct and return userid', function(done) {
           chai.request(serverAddress) 
            .post('/users')
            .send({
                email: "john.doe.testmail@fakemail.com",
                username: "Johnny Doo",
                password: "strongandcomplicatedpassword"
            })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                done()
            })
        })
        it('should reject user creation when a user with same email already exists', function(done) {
           chai.request(serverAddress) 
            .post('/users')
            .send({
                email: "john.duplicatte@fakemail.com",
                username: "Johnny Doo",
                password: "strongandcomplicatedpassword"
            })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
            })
            chai.request(serverAddress)
            .post('/users')
            .send({
                email: "john.duplicatte@fakemail.com",
                username: "Johnny Doo",
                password: "strongandcomplicatedpassword"
            })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(409)
                done()
            })
        })

        it('should reject request with missing field from data structure', function(done) {
           chai.request(serverAddress) 
            .post('/users')
            .send({
                email: "john.doe.rejected@fakemail.com",
                username: "Johnny Doo",
            })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(400)
                done()
            })
        })

        it('should reject request with incorrect data types', function(done) {
           chai.request(serverAddress) 
            .post('/users')
            .send({
                email: "mr.smith@fakemail.com",
                username: ["scooby doo"],
                password: 1234
            })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(400)
                done()
            })

        })

        it('should reject request with too much data field', function(done) {
           chai.request(serverAddress) 
            .post('/users')
            .send({
                email: "john.doe@fakemail.com",
                username: "Johnny Doo",
                password: "strongandcomplicatedpassword",
                password2: 1234
            })
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(400)
                done()
            })

        })

        it('should reject empty post request', function(done) {
           chai.request(serverAddress) 
            .post('/users')
            .send()
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(400)
                done()
            })
        })
    })

    describe('POST /login', function() {
        it('should login the user with correct login information', function(done) {
            chai.request(serverAddress)
                .post('/users/login')
                .auth("john.doe@fakemail.com", "strongandcomplicatedpassword")
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    token = res.body.token
                    expect(token).to.not.be.null
                    done()
                })
        })

        it('should reject login to user with invalid password', function(done) {
            chai.request(serverAddress)
                .post('/users/login')
                .auth("john.doe@fakemail.com", "invalidpassword")
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    done()
                })
        })

        it('should reject login when user is not found', function(done) {
            chai.request(serverAddress)
                .post('/users/login')
                .auth("nonexistingemailaddress", "strongandcomplicatedpassword")
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    done()
                })
        })
    })

    describe('PUT /update', function() {
        it('should update data when data is correct and user authorized', function(done) {
            chai.request(serverAddress)
                .put('/users/update')
                .set({ "Authorization": `Bearer ${token}` })
                .send({
                    username: "Günter",
                    email: "what.even@is.email",
                    password: "evenstrongerandmorecomplicatedpassword"
                })
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    done()
                })
        })

        it('should reject request when fields are missing', function(done) {
            chai.request(serverAddress)
                .put('/users/update')
                .set({ "Authorization": `Bearer ${token}` })
                .send({
                    username: "Günter",
                    email: "what.even@is.email",
                })
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    done()
                })
        })

        it('should reject data with no token', function(done) {
            chai.request(serverAddress)
                .put('/users/update')
                .send({
                    username: "Günter",
                    email: "what.even@is.email",
                    password: "evenstrongerandmorecomplicatedpassword"
                })
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    done()
                })
        })

        it('should reject data with wrong token', function(done) {
            chai.request(serverAddress)
                .put('/users/update')
                .set({ "Authorization": `Bearer öahewnaelasd.w93ohnoc.öaoei` })
                .send({
                    username: "Günter",
                    email: "what.even@is.email",
                    password: "evenstrongerandmorecomplicatedpassword"
                })
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    done()
                })
        })
    })

    describe('DELETE /delete', function() {
        it('should delete the user data', function(done) {
            chai.request(serverAddress)
                .delete('/users/delete')
                .set({ "Authorization": `Bearer ${token}` })
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    done()
                })
        })

        it('should reject data with no token', function(done) {
            chai.request(serverAddress)
                .delete('/users/delete')
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    done()
                })

        })

        it('should reject data with wrong token', function(done) {
            chai.request(serverAddress)
                .delete('/users/delete')
                .set({ "Authorization": `Bearer oawbekjfaw.eno3b` })
                .end((err,res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(401)
                    done()
                })

        })
    })

})