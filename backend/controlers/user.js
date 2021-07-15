const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
var key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
var iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
//La clé et le vecteur d'initialisation sont fixes pour obtenir le même résultat de cryptage AES lors du login et du signup.

exports.signup = (req, res, next) => {
  const id = req.body._id;
  delete req.body._id;
  var mailChiffre = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
  //On crypte les adresses email en AES pour sécuriser le contenu de la BDD.
  //Les adresses pourront être décriptées pour contacter les utilisateurs si nécessaire.
  //les MDP sont hashés sous bcrypt et salés 10 fois.
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: mailChiffre,
        password: hash,
        userId: id
      });
      
      console.log("user :", user);
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  var mailChiffre = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
  //l'adresse mail du login est chiffrées en AES et comparée à l'adresse mail de l'inscription chifrée elle aussi.
  User.findOne({ email: mailChiffre })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      //les hash des mots de passe sont comparés.
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            //On utilise la fonction sign de jsonwebtoken pour créer un token personalisé.
            //RANDOM_TOKEN_SECRET est une clé secrète temporaire pour le développement.
            //La durée du token est de 24h.
            token: jwt.sign(
              { userId: user._id },
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(501).json({ error }));
};