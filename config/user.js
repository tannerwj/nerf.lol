const mongoose = require('mongoose')
const Schema = mongoose.Schema

var userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	admin: Boolean,
	favorites: Array,
	created_on: Date
})

userSchema.pre('save', function (next) {
	if (!this.created_on){ 
		this.created_on = new Date() 
	}
	next()
})

var User = mongoose.model('User', userSchema)

module.exports = User
