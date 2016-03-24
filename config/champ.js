const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ChampionSchema = new Schema({
  id: { type: Number, unique: true },
  title: String,
  name: { type: String, unique: true },
  image: {
    w: { type: Number },
    full: { type: String },
    sprite: { type: String },
    group: { type: String },
    h: { type: Number },
    y: { type: Number },
    x: { type: Number }
  },
	blurb: String,
	key: String,
	upVotes: { type: Number, default: 0 },
	downVotes: { type: Number, default: 0 },
  totalVotes: { type: Number, default: 0 },
  upPercent: { type: Number, default: 0 },
  downPercent: { type: Number, default: 0 },
  difference: { type: Number, default: 0 }
})

ChampionSchema.post('findOneAndUpdate', function (doc){
  doc.totalVotes = doc.upVotes + doc.downVotes
  doc.difference = doc.upVotes - doc.downVotes
  if(doc.totalVotes){
    doc.upPercent = Math.round((doc.upVotes / doc.totalVotes) * 100)
    doc.downPercent = Math.round((doc.downVotes / doc.totalVotes) * 100)
  }
  doc.save()
})

module.exports = mongoose.model('Champion', ChampionSchema)
