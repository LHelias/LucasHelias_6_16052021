const mongoDBConfig = require('./MongoDBConfig');
const bodyParser = require('body-parser');
const express = require('express');
const allRoutes = require('./routes/allRoutes');
const userRoutes = require ('./routes/user');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://' + mongoDBConfig.username + ':' + mongoDBConfig.password + '@clusteroc-cours.v3ntp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.use(allRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

