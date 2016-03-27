const express = require('express')
const router = express.Router()

const f = require('../src/functions')

router.post('/lookup/currentGame',function(req,res){
	return f.getCurrentGame(req.body.name).then(function (data){
    res.json(data)
  }).catch(function (err){
    res.status(500).send(err)
  })
})

module.exports = router
