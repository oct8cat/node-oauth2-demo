'use strict';

var _ = require('lodash')
var oauth2orize = require('oauth2orize')
var util = require('./util')
var clients = require('./clients')

var codes = []
var tokens = []

var oauth2 = module.exports = oauth2orize.createServer()

oauth2.serializeClient(function (client, done) {
    done(null, client.id)
})

oauth2.deserializeClient(function (id, done) {
    done(null, _.findWhere(clients, {id: Number(id)}))
})

oauth2.grant(oauth2orize.grant.code(function (client, redirectURI, user, ares, done) {
    var code = {
        value: util.uid(16),
        client: client.id,
        redirectURI: redirectURI,
        user: user.login,
        scope: ares.scope
    }
    codes.push(code)
    done(null, code.value)
}))

oauth2.exchange(oauth2orize.exchange.code(function (client, codeValue, redirectURI, done) {
    var code = _.findWhere(codes, {value: codeValue})
    if (!code) { done(null, code); return }
    var token = {
        value: util.uid(256),
        user: code.user,
        client: code.client,
        scope: code.scope
    }
    tokens.push(token)
    done(null, token.value)
}))
