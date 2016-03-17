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
	upvotes: { type: Number, default: 0 },
	downvotes: { type: Number, default: 0 }
})

module.exports = mongoose.model('Champion', ChampionSchema)
