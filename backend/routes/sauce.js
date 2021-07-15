const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controlers/sauce');
//on importe multer et on le configure sur les deux routes où l'on a besoin d'importer des fichiers.
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');

//on gère le token d'identification via le middleware auth.js pour chaque utilisation des routes du controleur des sauces.
router.post('/',auth , multer, sauceCtrl.addSauce);

router.get('/',auth , sauceCtrl.getSauces);

router.get('/:id',auth , sauceCtrl.getOneSauce);

router.put('/:id',auth , multer, sauceCtrl.updateSauce);

router.delete('/:id',auth , sauceCtrl.deleteSauce);

router.post('/:id/like' ,auth, sauceCtrl.likeSauce);

module.exports = router;