/*
 * NERF.LOL - Yet another front end for Riot's API
 */
require('dotenv').config()
const http = require('http')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')

var app = express()

app.set('port', process.env.PORT || 8080)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'))
app.use(favicon(__dirname + '/public/img/favicon.ico'))

app.use('/', require('./routes/main'))

http.createServer(app).listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
})
