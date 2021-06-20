const { ObjectId } = require('bson');
const fs = require('fs');
const sauce = require('../models/sauce');
const Sauce = require('../models/sauce');

exports.addSauce = (req, res, next) => {
    console.log("addSauce");
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject);
    const sauce = new Sauce({
        userId: sauceObject.userId,
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        mainPepper: sauceObject.mainPepper,
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        heat: sauceObject.heat
    });
    console.log(sauce);
    sauce.save()
    .then(() => res.status(201).json({message: 'sauce enregistrée'}))
    .catch(error => res.status(400).json({ error }));
}

exports.getSauces = (req, res, next) => {
    console.log("getSauces");
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
}

exports.getOneSauce = (req, res, next) => {
    console.log("getOneSauce");
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
}

exports.updateSauce = (req, res, next) => {
    console.log('updateSauce');
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` 
         } : {...req.body}
    Sauce.findOneAndUpdate({_id: req.params.id }, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/uploads/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then( () => res.status(200).json({message: 'objet supprimé !'}))
                    .catch( error => res.status(404).json({ error }));
            });
        })
        .catch(error => res.status(500).json({error}));
};

exports.likeSauce = (req, res, next) => {
    // Sauce.findOne({ _id: req.params.id})
    //     .then( () => )
    //     .catch(error => res.status(400).json({error}))
    Sauce.updateOne({ _id: req.params.id }, req.params.like )
    .then(() => res.status(200).json({ message: 'likes modifiés !'}))
    .catch(error => res.status(400).json({ error }));
}