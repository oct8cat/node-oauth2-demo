'use strict';

var PORT = process.env.PORT || 3000

var assert = require('assert')
var supertest = require('supertest')

var app = require('..')

var getAgent = function () {
    return supertest.agent(app)
}

before(function (done) {
    app.listen(PORT, function () {
        done()
    })
})

it('Should be fine', function (done) {
    var agent = getAgent()
    agent
    .post('/sign/in')
    .send({login: 'test', password: 'test'})
    .expect(302, function (err, res) {
        if (err) { done(err); return }
        agent
        .get('/oauth/authorize?response_type=code&client_id=1&redirect_uri=/redirect')
        .expect(200, function (err, res) {
            if (err) { done(err); return }
            agent
            .post('/oauth/authorize?transaction_id=' + res.body.transactionID)
            .expect(302, function (err, res) {
                if (err) { done(err); return }
                var code = res.headers.location.replace(/.*=/, '')
                agent
                .post('/oauth/token')
                .send({grant_type: 'authorization_code', code: code})
                .expect(200, function (err, res) {
                    assert.equal(res.body.access_token.length, 256)
                    assert.equal(res.body.token_type, 'Bearer')
                    done()
                })
            })
        })
    })
})
