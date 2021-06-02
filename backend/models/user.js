const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const userSchema = mongoose.Schema({
    userId: {type: ObjectId},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);