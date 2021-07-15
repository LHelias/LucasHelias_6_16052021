const { ObjectId } = require('bson');
const fs = require('fs');
const Sauce = require('../models/sauce');

exports.addSauce = (req, res, next) => {
    console.log("addSauce");
    const sauceObject = JSON.parse(req.body.sauce);
    //on extrait les infos du body de la requête et on les insère dans l'objet sauceObject
    console.log(sauceObject);
    //On crée une nouvelle sauce et on met les infos de sauceObject dans les paramètres de la sauce.
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
    //on sauvegarde la nouvelle sauce dans la BDD.
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
    //si req.file existe, on traite la nouvelle image, sinon on traite tous les autres champs.
    Sauce.findOneAndUpdate({_id: req.params.id }, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/uploads/')[1];

            // utilise la fonction unlink pour supprimer les images des sauces du dossier uploads
            fs.unlink(`uploads/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then( () => res.status(200).json({message: 'objet supprimé !'}))
                    .catch( error => res.status(404).json({ error }));
            });
        })
        .catch(error => res.status(500).json({error}));
};

exports.likeSauce = (req, res, next) => {
    console.log("likeSauce");
    let response;
    Sauce.findOne({_id: req.params.id})
        .then(function (sauce) {
                console.log("like:", req.body.like);
                //Si l'utilisateur like une sauce et qu'il ne l'a pas déja liké, on incrémente le compteur de likes et on l'ajoute à la liste des likes.
                if (req.body.like == 1 && userIsInArray(req.body.userId, sauce.userLiked) == false){
                    sauce.likes += 1;
                    sauce.userLiked.push(req.body.userId);
                    //Si l'utilisateur a déjà disliké la sauce, ont enlève le dislike et on le sort de la liste des dislikes.
                    if (userDisliked(req.body.userId, sauce.userDisliked)) {
                        removeUserIdFromSauce(req.body.userId, sauce.userDisliked);
                        sauce.dislikes += -1;
                        console.log("user undisliked")
                    }
                }
                //Si l'utilisateur dislike une sauce et qu'il ne l'a pas déja disliké, on incrémente le compteur de dislikes et on l'ajoute à la liste des dislikes.
                else if (req.body.like == -1 && userIsInArray(req.body.userId, sauce.userDisliked) == false){
                    sauce.dislikes += 1;
                    sauce.userDisliked.push(req.body.userId);
                    //Si l'utilisateur a déjà liké la sauce, ont enlève le like et on le sort de la liste des likes.
                    if (userLiked(req.body.userId, sauce.userLiked)) {
                        removeUserIdFromSauce(req.body.userId, sauce.userLiked);
                        sauce.likes += -1;
                        console.log("user unliked")
                    }
                }
                
                else if (req.body.like == 0){
                    //si l'utilisateur annule son like, on le retire de la liste des likes et on décrémente le compteur des likes.
                    if (userLiked(req.body.userId, sauce.userLiked)) {
                        removeUserIdFromSauce(req.body.userId, sauce.userLiked);
                        sauce.likes += -1;
                        console.log("user unliked")
                    }
                    //si l'utilisateur annule son dislike, on le retire de la liste des dislikes et on décrémente le compteur des dislikes.
                    else if (userDisliked(req.body.userId, sauce.userDisliked)) {
                        removeUserIdFromSauce(req.body.userId, sauce.userDisliked);
                        sauce.dislikes += -1;
                        console.log("user undisliked")
                    }
                }
                response = sauce;
                return res.status(200).json(sauce)
            })
            .then(function () {
                    console.log("Response: ", response)
                    return Sauce.updateOne({ _id: req.params.id }, {likes: response.likes, dislikes: response.dislikes, userLiked: response.userLiked, userDisliked: response.userDisliked, _id: req.params.id});
                }, )
            .catch(error => res.status(400).json({error}))
        .catch(error => res.status(404).json({error}));
}

//les quatre fonctions suivantes sont utilisées dans la fonction likeSauce.
function removeUserIdFromSauce(id,userArray){
    for (i in userArray){
        if(userArray[i] == id){
            userArray.splice(i,1);
        }
    }
}

function userIsInArray(id, userArray){
    for (i in userArray){
        console.log("userarray[", i, "]:", userArray[i], "Id:", id);
        if(userArray[i] == id){
            return true;
        }   
    }
    return false;
}

function userLiked(id, userArray){
    return userIsInArray(id, userArray);
}
function userDisliked(id, userArray){
    return userIsInArray(id, userArray);
}