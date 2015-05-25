'use strict';

var _ = require('lodash')
var passport = module.exports = require('passport')
var LocalStrategy = require('passport-local')

var users = [
    {login: 'test', password: 'test'}
]

passport.use(new LocalStrategy({usernameField: 'login'}, function (login, password, done) {
    var user = _.findWhere(users, {login: login, password: password})
    done(null, user)
}))

passport.serializeUser(function (user, done) {
    done(null, user.login)
})

passport.deserializeUser(function (login, done) {
    done(null, _.findWhere(users, {login: login}))
})

