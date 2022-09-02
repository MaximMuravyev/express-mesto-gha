const router = require('express').Router();
const ErrorNotFound = require('../errors/ErrorNotFound');

router.use('/404', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена')); // страница ошибки 404
});

router.use('/', (req, res) => {
  res.redirect('/404'); // при попытке получить роут, не обозначенный выше, редирект на страницу 404
});

module.exports = router;
