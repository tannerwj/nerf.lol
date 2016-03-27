/*
 * NERF.LOL - Yet another front end for Riot's API
 */
require('dotenv').config()
const http = require('http')
const express = require('express')
const passport = require('passport')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser')
const session = require('express-session')
const favicon = require('serve-favicon')
const bcrypt = require('bcrypt-nodejs')
const path = require('path')
const User = require('./config/user')

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

passport.use(new LocalStrategy(function (username, password, done) {
	User.find({ username: username }).then(function (user){
		var user = user[0]
		if(!user){ return done(null, false) }
		bcrypt.compare(password, user.password, function (err, res) {
			if(res){
				console.log(user.username + ' loggin in')
				return done(null, { username: user.username, favorites: user.favorites, admin: user.admin })
			}
			done(null, false)
		})
	})
}))
passport.serializeUser(function (user, done) {
	done(null, user.username)
})
passport.deserializeUser(function (username, done) {
	User.find({ username: username }).then(function (user){
		var user = user[0]
		done(null, { username: user.username, favorites: user.favorites, admin: user.admin })
	})
})

app.all('/lookup/*', require('./routes/lookup'))
app.all('/nerfem/*', require('./routes/nerfem'))
app.all('/hidden/*', require('./routes/hidden'))
app.use('/', require('./routes/main'))
app.use(express.static(__dirname + '/public'))

app.get('*', function (req, res){
	console.log('catch all', req.originalUrl)
	res.sendFile('index.html', { root: path.join(__dirname, './public') })
})

http.createServer(app).listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'))
})
