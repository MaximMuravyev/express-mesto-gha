const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const urlPattern = require('../utils/url-type');
const { createUser, login } = require('../controllers/users');

// валидируем поступающие запросы
router.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required(),
  }),
}), login);

router.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required(),
    name: Joi.string()
      .min(2)
      .max(30)
      .allow('', null)
      .empty(['', null])
      .default('Жак-Ив Кусто'),
    about: Joi.string()
      .min(2)
      .max(30)
      .allow('', null)
      .empty(['', null])
      .default('Исследователь'),
    avatar: Joi.string()
      .pattern(urlPattern) // регулярное выражение для ссылки
      .allow('', null)
      .empty(['', null])
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
      .messages({ 'string.pattern.base': 'Invalid URL' }), // замена дефолтного сообщения для ошибки string.pattern.base - ошибка паттерна
  }),
}), createUser);

module.exports = router;
