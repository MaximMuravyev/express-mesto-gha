const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const urlPattern = require('../utils/url-type');
const {
  getUsers, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserById);

router.get('/:userId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.length': 'Incorrect id',
        'string.hex': 'Incorrect id',
      }), // кастомные сообщения об ошибках
  }),
}), getUserById);

router.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30),
    about: Joi.string()
      .min(2)
      .max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string()
      .pattern(urlPattern) // регулярное выражение для ссылки
      .messages({ 'string.pattern.base': 'Invalid URL' }), // замена дефолтного сообщения для ошибки string.pattern.base - ошибка паттерна
  }),
}), updateAvatar);

module.exports = router;
