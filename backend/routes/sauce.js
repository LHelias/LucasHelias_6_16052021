const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controlers/sauce');
const multer = require('../middleware/multer-config');

router.post('/', multer, sauceCtrl.addSauce);

router.get('/', sauceCtrl.getSauces);

router.get('/:id', sauceCtrl.getOneSauce);

router.put('/:id', multer, sauceCtrl.updateSauce);

router.delete('/:id', sauceCtrl.deleteSauce);

router.post('/:id/like' ,sauceCtrl.likeSauce);

module.exports = router;