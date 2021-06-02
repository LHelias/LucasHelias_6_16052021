const { ObjectId } = require('bson');
const Sauce = require('../models/sauce');

exports.addSauce = (req, res, next) => {
    console.log("coucou")

    const sauce = new Sauce({
        userId: req.body.userId,
        name: req.body.sauce,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        mainPepper: req.body.mainPepper,
        imageUrl: req.body.imageUrl,
        heat: req.body.heat,
        likes: 0,
        dislikes: 0,
        userliked: [],
        userDisliked:[]
    });
    console.log(sauce);
    sauce.save()
    .then(() => res.status(201).json({message: 'sauce enregistrée'}))
    .catch(error => res.status(400).json({ error }));
}