const lol = require('./lolapi/lolapi')
const Champ = require('../config/champ')
const Promise = require('bluebird')

//const redisClient = require('redis').createClient
//const redis = redisClient(6379, 'localhost')

lol.init(process.env.API_KEY, 'na')

var getCurrentGame = function (name){
  console.log('getting current game', name)
  var name =name.toLowerCase().replace(/ /g,'')
  return lol.Summoner.getByNameCache(name).then(function (summoner){
    return lol.getCurrentGame(summoner.sumId).catch(function (){
      return {
        failed: true,
        msg: 'not in game'
      }
    })
  }).catch(function (){
    return {
      failed: true,
      msg: 'not valid summoner'
    }
  })
}

var getMatches = function (name){
  var name = name.toLowerCase().replace(/ /g,'')
  return lol.Summoner.getByNameCache(name).then(function (summoner){
    if(summoner.failed){ return summoner }
    var options = { beginIndex: 0, endIndex: 9 }
    return lol.getMatchHistory(summoner.sumId, options).then(function (data){
      if(data.totalGames === 0){ 
        return {
          failed: true,
          msg: 'no matches'
        }
      }
      return Promise.map(data.matches, function (match){
        return lol.getMatchCache(match.matchId).then(function (data){
          return data
        }).catch(function (err){
          return false
        })
      })
    })
  })
}

var getHiddenPassive = function (playerName){
  console.log('getting hidden passive', playerName)
  var playerName = playerName.toLowerCase()

  return Promise.all([
    Champ.find({}, 'name id image'),
    getMatches(playerName)
  ]).then(function (results){

    var matches = results[1]
    if(matches.failed){ return matches }

    var champions = results[0]

    var teammates = {}
    var opponents = {}
    var playerTeam, playerId, playerWon

    for(var i = 0, len = matches.length; i < len; ++i){
      var match = matches[i]
      if(!match){ continue }

      //find which player requested the info, and which team the player was on
      for(var j = 0, len2 = match.participantIdentities.length; j < len2; ++j){
        if(match.participantIdentities[j].player.summonerName.toLowerCase() === playerName){
          playerId = match.participantIdentities[j].participantId
          playerTeam = match.participants[j].teamId
          break
        }
      }

      //find if that team won
      for(var j = 0, len3 = match.teams.length; j < len3; ++j){
        if(match.teams[j].teamId === playerTeam){
          playerWon = match.teams[j].winner
          break
        }
      }

      //find all champions played with/agains
      for(var j = 0, len2 = match.participants.length; j < len2; ++j){
        var participant = match.participants[j]
        //skip requesting players data
        if(participant.participantId === playerId){ continue }

        var obj, won

        //count wins for each champion respectively
        if(participant.teamId === playerTeam){
          obj = teammates
          won = playerWon ? 1 : 0
        }else{
          obj = opponents
          won = !playerWon ? 1 : 0
        }

        //if already played with champ
        if(obj[participant.championId]){
          obj[participant.championId].gamesPlayed++
          obj[participant.championId].wins += won

        //first time playing with champ
        }else{
          var champName, src
          for(var k = 0, len3 = champions.length; k < len3; ++k){
            if(champions[k].id === participant.championId){
              champName = champions[k].name
              src = champions[k].image.full
              break
            }
          }
          obj[participant.championId] = {
            gamesPlayed: 1,
            wins: won,
            champName: champName,
            src: src
          }
        }
      }
    }

    //convert to array
    return {
      opponents: Object.keys(opponents).map(function (key){ return opponents[key] }).sort(function (a, b){ return b.wins - a.wins }),
      teammates: Object.keys(teammates).map(function (key){ return teammates[key] }).sort(function (a, b){ return b.wins - a.wins })
    }
  }).catch(function (err){
    console.log('hidden passive error', err)
    return {
      failed: true,
      msg: 'hidden passive error'
    }
  })
}

/*var getChampFromName = function (champName){
  return new Promise(function (resolve, reject){
    redis.get('champ:' + champName, function (err, reply){
      if (reply){
        return resolve(JSON.parse(reply))
      }
      Champ.find({
        name: champName
      }).then(function (data){
        if (!data.length){
          reject('champion not found')
        }else{
          redis.set('champ:' + champName, JSON.stringify(data[0]), function (err){
            if (err){ console.log('save reddis error', err) }
          })
          return resolve(data[0])
        }
      })
    })
  })
}*/

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
  checkForChamps: checkForChamps,
  getHiddenPassive: getHiddenPassive
}
