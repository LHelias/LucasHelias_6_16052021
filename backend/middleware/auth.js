const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; //récupère le token de la requête entrante.
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //on utilise la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée.
    const userId = decodedToken.userId; //on extrait l'id utilisateur du token.
    if (req.body.userId && req.body.userId !== userId) { //si la requète contient un userId, on le compare avec l'userId contenu dans le token.
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};