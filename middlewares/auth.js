const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация')); // выкидываем ошибку, если токена нет в req.headers
  }

  const token = authorization.replace('Bearer ', ''); // получаем чистый токен
  let payload;

  try {
    payload = jwt.verify(token, 'this-is-my-secret-key'); // попытка верификации токена с помощью секретной строки
  } catch (e) {
    return next(new AuthError('Необходима авторизация'));
  }

  req.user = payload; // будем обращаться к payload токена через req.user
  next();
};
