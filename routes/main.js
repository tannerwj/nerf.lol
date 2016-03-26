const express = require('express')
const router = express.Router()
const path = require('path')
const lol = require('leagueapi')
const passport = require('passport')
const bcrypt = require('bcrypt-nodejs')
const db = require('../config/db.js')
const Champ = require('../config/champ')
const User = require('../config/user')

const BCRYPT_ROUNDS = 11

lol.init(process.env.API_KEY, 'na')

router.get('/', function (req, res) {
	res.sendFile('index.html', { root: path.join(__dirname, '../public') })
})

router.post('/login', function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err){ return next(err) }
		if (!user){ return res.sendStatus(401) }

		req.logIn(user, function (err){
			if (err){ return next(err) }
			return res.send(user.favorites)
		})
	})(req, res, next)
})

router.get('/logout', function (req, res) {
	if(req.user){
		console.log(req.user.username + ' logged out')
		req.logout()
	}
	res.sendStatus(200)
})

router.get('/loggedin', function (req, res) {
	res.json(req.isAuthenticated() ? req.user.favorites : false)
})

router.post('/register', function (req, res) {
	bcrypt.genSalt(BCRYPT_ROUNDS, function (salt){
    bcrypt.hash(req.body.password, salt, null, function (err, hash) {
      if(err) return res.sendStatus(400)
			var u = new User({ username: req.body.username, password: hash})
			u.save().then(function (data){
				passport.authenticate('local')(req, res, function (){
					res.sendStatus(200)
				})
			}).catch(function (err){
				res.sendStatus(400)
			})
    })
  })
})

router.post('/saveFav', function (req, res){
	if(!req.user){ return res.sendStatus(401) }
	User.findOneAndUpdate({username: req.user.username}, {$push: {favorites: req.body}}).then(function (result){
		res.sendStatus(200)
	}).catch(function (){
		res.sendStatus(400)
	})
})

router.post('/deleteFav', function (req, res){
	if (!req.user){ return res.sendStatus(401) }
	User.findOneAndUpdate({username: req.user.username}, {$pull: {favorites: req.body}}).then(function (result){
		res.sendStatus(200)
	}).catch(function (){
		res.sendStatus(400)
	})
})

router.get('/data/champions', function (req, res){
	Champ.find({}, 'name upPercent downPercent upVotes downVotes totalVotes difference image').sort({ difference: 1 }).then(function (champs){
		if(!champs.length) return res.send('Run checkForChamps() first')
		res.json(champs)
	})
})

router.post('/data/upVote', function (req, res){
	Champ.findOneAndUpdate({name: req.body.name}, {$inc: { 'upVotes' : 1 }}, function (err, doc){
		res.sendStatus(err ? 400 : 200)
	})
})

router.post('/data/downVote', function (req, res){
	Champ.findOneAndUpdate({name: req.body.name}, {$inc: { 'downVotes' : 1 }}, function (err, doc){
		res.sendStatus(err ? 400 : 200)
	})
})

//eventually set to run every tuesday, if version is different
//save champs again, does not allow duplicates
var checkForChamps = function (){
	var options = {champData: 'image,blurb', locale: 'en_US', dataById: true}
	return lol.Static.getChampionList(options).then(function (data){
		Object.keys(data.data).forEach(function (prop){
			var c = new Champ(data.data[prop])
			c.save().then(function (champ){
				console.log(champ.key + ' saved')
			})
		})
	})
}

module.exports = router
