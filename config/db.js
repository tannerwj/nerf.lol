const mongoose = require('mongoose')

mongoose.connect('mongodb://' + process.env.DB_HOST + '/nerf')

var db = mongoose.connection

db.on('error', console.error.bind(console, 'DB connection error:'))

db.once('open', console.error.bind(console, 'DB connected'))

var getDB = function (){
  return new Promise(function (resolve, reject){
    if(db) return resolve(db)
    setTimeout(function (){
      resolve(getDB())
    }, 100)
  })
}

module.exports = getDB()
