const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie;
  if (!authorization || !authorization.startsWith('jwt=')) {
    next(new AuthError('Необходима авторизация'));
  } else {
    const token = authorization.replace('jwt=', '');
    let payload;
    try {
      payload = jwt.verify(token, 'this-is-my-secret-key');
    } catch (err) {
      next(new AuthError('Необходима авторизация'));
    }

    req.user = payload;
    next();
  }
};
