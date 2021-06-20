const { ObjectID } = require('bson');
const mongoose = require('mongoose');

const sauceShema = mongoose.Schema({
    id: {type: ObjectID},
    userId:{type: String},
    name: {type: String, required: true},
    manufacturer: {type: String},
    description: {type: String},
    mainPepper: {type: String},
    imageUrl: {type : String, required: true},
    heat: {type: Number},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0},
    userLiked: {type: [String], default: []},
    userDisliked: {type: [String], default: []}
})

module.exports = mongoose.model('Sauce', sauceShema);

