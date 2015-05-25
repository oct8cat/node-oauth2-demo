'use strict';

var PORT = process.env.PORT || 3000

var _ = require('lodash')
var express = require('express')
var bp = require('body-parser')
var session = require('express-session')

var clients = require('./clients')
var passport = require('./passport')
var oauth2 = require('./oauth2')

var app = module.exports = express()

app
.use(session({secret: 'secret', saveUninitialized: true, resave: true}))
.use(passport.initialize())
.use(passport.session())
.post('/sign/in',
    bp.json(),
    passport.authenticate('local'),
    function (req, res, next) { res.redirect('/') }
)
.get('/oauth/authorize',
    oauth2.authorize(function (clientID, redirectURI, done) {
        var client = _.findWhere(clients, {id: Number(clientID)})
        done(null, client, client.redirectURI)
    }),
    function (req, res, next) { res.send(req.oauth2) }
)
.post('/oauth/authorize', bp.json(), oauth2.decision())
.post('/oauth/token', bp.json(), oauth2.token())

if (require.main === module) {
    app.listen(PORT, function () {
        console.log(PORT)
    })
}
