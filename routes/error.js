const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');

router.use('/404', (req, res, next) => {
  next(new NotFoundError('Страница не найдена')); // страница ошибки 404
});

router.use('/', (req, res) => {
  res.redirect('/404'); // при попытке получить роут, не обозначенный выше, редирект на страницу 404
});

module.exports = router;
