const mongoose = require('mongoose')
const Schema = mongoose.Schema

var UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	admin: { type: Boolean, default: false },
	favorites: [{
		name: { type: String, unique: true }
	}]
})

module.exports = mongoose.model('User', UserSchema)
