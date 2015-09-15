/**
 * Created by joseant on 15/09/15.
 */
var request = require('supertest');
var config = require('../../config/properties-test');
var express = require('express');
var boards = require('../../controllers/boards');
var bodyParser = require('body-parser');

describe('Rest API Test Suite', function () {
    var app;
    beforeAll(function () {
    });

    beforeEach(function () {
        //Prepare express and the middlewares
        app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use('/boards', boards);
    });

    afterEach(function () {
    });


    describe('GET /boards', function () {
        it('shall respond with json', function (done) {
            request(app).get("/boards")
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    expect(err).toBe(null);
                    done();
                });
        });
        it('shall respond not empty', function (done) {
            request(app)
                .get('/boards')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    expect(res).not.toBe(null);
                    done();
                })
        });
        it('shall not return any sensor', function (done) {
            request(app)
                .get('/boards')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    for (board in res.body) {
                        for (sensor in board.sensors) {
                            assert(sensor).toBe(null);
                        }
                    }
                    done();
                })
        });
    });
    //Calling an external server
    xdescribe("GET /boards", function () {
        it('shall respond with json', function (done) {
            request('http://' + config.server.host + ':' + config.server.port).get("/boards")
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    expect(err).toBe(null);
                    done();
                });
        });
        it('shall respond not empty', function (done) {
            request('http://' + config.server.host + ':' + config.server.port).get("/boards").end(function (err, res) {
                expect(res).not.toBe(null);
                done();
            });
        })
    });

    describe("GET /boards/:id", function () {
        it("shall return all the sensors", function (done) {
            request(app)
                .get("/boards")
                .expect(200)
                .end(function (err, res) {
                    request(app)
                        .get("/boards/" + res.body[0].id)
                        .expect(200)
                        .end(function (err, res) {
                            expect(err).toBe(null);
                            expect(res.body.sensors).not.toBe(null);
                            done()
                        });
                });
        });
        it("shall return 404 if the board does not exist", function (done) {
            request(app).get("/boards/testboard13")
                .expect(404, function (err) {
                    expect(err).toBe(null);
                    done();
                });
        });
    });

    describe("POST /boards", function () {
        it("shall return 201 code and the values inserted", function (done) {
            request(app)
                .post("/boards")
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send({id: '1234'})
                .send({protocol: 'USB'})
                .send({description: 'Test board'})
                .expect(201)
                .end(function (err, res) {
                    expect(err).toBe(null);
                    expect(res.body.id).toBe('1234');
                    expect(res.body.protocol).toBe('USB');
                    expect(res.body.description).toBe('Test board');
                    done();
                });
        });
        it("empty body must be rejected", function (done) {
            request(app)
                .post("/boards")
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(400)
                .end(function (err, res) {
                    expect(err).toBe(null);
                    done();
                });
        });

    });
    desc
});