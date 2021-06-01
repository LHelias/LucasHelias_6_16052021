const { ObjectID } = require('bson');
const mongoose = require('mongoose');

const sauceShema = mongoose.Schema({
    id: {type: ObjectID},
    userId:{type: String},
    name: {type: String, required: true},
    manufacturer: {type: String},
    description: {type: String},
    mainPepper: {type: String},
    imageUrl: {type : String},
    heat: {type: Number},
    likes: {type: Number},
    dislikes: {type: Number},
    userLiked: {type: [String]},
    userDisliked: {type: [String]}
})

module.exports = mongoose.model('Sauce', sauceShema);

