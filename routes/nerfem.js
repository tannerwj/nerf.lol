const express = require('express')
const router = express.Router()

const lol = require('../src/lolapi/lolapi')
const Champ = require('../config/champ')

lol.init(process.env.API_KEY, 'na')

router.get('/nerfem/champions', function (req, res){
	Champ.find({}, 'name upPercent downPercent upVotes downVotes totalVotes difference image').sort({ difference: 1 }).then(function (champs){
		if(!champs.length) return res.send('Run checkForChamps() first')
		res.json(champs)
	})
})

router.post('/nerfem/upVote', function (req, res){
	Champ.findOneAndUpdate({name: req.body.name}, {$inc: { 'upVotes' : 1 }}, function (err, doc){
		res.sendStatus(err ? 400 : 200)
	})
})

router.post('/nerfem/downVote', function (req, res){
	Champ.findOneAndUpdate({name: req.body.name}, {$inc: { 'downVotes' : 1 }}, function (err, doc){
		res.sendStatus(err ? 400 : 200)
	})
})

module.exports = router
