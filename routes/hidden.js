const express = require('express')
const router = express.Router()

const f = require('../src/functions')

router.post('/hidden/pastGames',function(req,res){
	return f.getMatches(req.body.name).then(function (data){
    res.json(data)
  }).catch(function (err){
    res.status(500).send(err)
  })
})

module.exports = router
