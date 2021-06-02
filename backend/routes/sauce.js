const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controlers/sauce')

router.post('/', sauceCtrl.addSauce);

router.get( (req, res, next) => {
    res.json({ message: 'votre requête a bien été reçue !' })
    next();
});

module.exports = router;