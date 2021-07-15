const dotenv = require('dotenv');
dotenv.config();
//configure l'utilisation d'un fichier .env pour les variables d'environnement

const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const sauceRoutes = require('./routes/sauce');
const userRoutes = require ('./routes/user');
const mongoose = require('mongoose');

//On configure la connection à MongoDB via mongoose en important les variables d'environnement process.env.DB_USERNAME et process.env.DB_PASSWORD
mongoose.connect('mongodb+srv://' + process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@clusteroc-cours.v3ntp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

//permet de résoudre les erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//bodyParser permet de traiter les requêtes POST
app.use(bodyParser.json());

//Cela indique à Express qu'il faut gérer la ressource images de manière statique (un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

