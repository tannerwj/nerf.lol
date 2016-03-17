/*
 * NERF.LOL - Yet another front end for Riot's API
 */
require('dotenv').config()
const http = require('http')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const favicon = require('serve-favicon')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

var app = express()

app.disable('x-powered-by')
app.set('port', process.env.PORT || 80)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser(process.env.SECRET || 'BYUcs360'))
app.use(session({
	secret: process.env.SECRET || 'BYUcs360',
	duration: 1 * 60 * 60 * 1000,
	cookie: {
		ephemeral: false,
		httpOnly: true,
		secure: false
	},
	resave: true,
	saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(favicon(__dirname + '/public/img/favicon.ico'))

app.use('/', require('./routes/main'))
app.use(express.static(__dirname + '/public'))

http.createServer(app).listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'))
})
