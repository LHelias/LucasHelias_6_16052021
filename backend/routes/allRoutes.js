const express = require('express');
const router = express.Router();
const Sauce = require('../models/sauce');

router.post( '/api/sauces', (req, res, next) => {
    console.log("coucou")
    const sauce = new Sauce({
        name: req.body.sauce
    });
    sauce.save()
    .then(() => res.status(201).json({message: 'sauce enregistrée'}))
    .catch(error => res.status(400).json({ error }));
});

router.get( (req, res, next) => {
    res.json({ message: 'votre requête a bien été reçue !' })
    next();
});

module.exports = router;