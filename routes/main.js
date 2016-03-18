const express = require('express')
const router = express.Router()
const path = require('path')
const lol = require('leagueapi')
const db = require('../config/db.js')
const Champ = require('../config/champ')

lol.init(process.env.API_KEY, 'na')

router.get('/', function (req, res) {
	res.sendFile('index.html', { root: path.join(__dirname, '../public') })
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
