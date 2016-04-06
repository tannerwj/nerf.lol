const express = require('express')
const router = express.Router()

const f = require('../src/functions')

const fs = require('fs')

router.post('/lookup/currentGame',function(req,res){
	fs.readFile('currentGame.txt', 'utf8', function (err, data) {
		if (err){ console.log('read file err', err) }
		res.json(JSON.parse(data))
	})
	//return f.getCurrentGame(req.body.name).then(function (data){
		//res.json(data)
	//}).catch(function (err){
	//	res.sendStatus(500)
	//})
})

module.exports = router
