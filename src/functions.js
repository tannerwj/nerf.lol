const lol = require('./lolapi/lolapi')
const Champ = require('../config/champ')
const Promise = require('bluebird')

lol.init(process.env.API_KEY, 'na')

var getCurrentGame = function (name){
  console.log('getting current game', name)
  var name =name.toLowerCase().replace(/ /g,'')
	return lol.Summoner.getByNameCache(name).then(function(summoner){
		return lol.getCurrentGame(summoner.sumId).catch(function (err){
      return 'not in game'
    })
	}).catch(function (err){
    console.log('get current game', err)
    return 'not summoner'
  })
}

var getMatches = function (name){
  console.log('getting past games', name)
  var name = name.toLowerCase().replace(/ /g,'')
  return lol.Summoner.getByNameCache(name).then(function(summoner){
    var options = { beginIndex: 1, endIndex: 9 }
    return lol.getMatchHistory(summoner.sumId, options).then(function (data){
      return Promise.map(data.matches, function (match){
        return lol.getMatchCache(match.matchId).then(function (data){
          return data
        })
      })
    })
  }).catch(function (err){
    console.log('get matches', err)
    return 'not summoner'
  })
}

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

module.exports = {
  getMatches: getMatches,
  getCurrentGame: getCurrentGame,
  checkForChamps: checkForChamps
}
