const ObjectID = require('mongodb').ObjectID;
//cette ligne est nécessaire pour importer le type ObjectId
const mongoose = require('mongoose');

const sauceShema = mongoose.Schema({
    id: {type: ObjectID}, //id unique créé par mongoDB
    userId:{type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type : String, required: true},
    heat: {type: Number, required: true},
    //ici on a des valeurs par défaut données lors de la création de la sauce
    likes: {type: Number, default: 0}, 
    dislikes: {type: Number, default: 0},
    userLiked: {type: [String], default: []},
    userDisliked: {type: [String], default: []}
})

module.exports = mongoose.model('Sauce', sauceShema);

