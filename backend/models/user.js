//configure le type ObjectID de mongoDb
const ObjectId = require('mongodb').ObjectID;
const mongoose = require('mongoose');

//importe le mongoose-unique-validator pour s'assurer qu'aucun user n'aie le même Email.
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    userId: {type: ObjectId},
    email: {type: String, required: true, unique: true}, // le mail est unique
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);