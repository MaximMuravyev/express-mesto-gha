const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const urlPattern = require('../utils/url-type');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .required(),
    link: Joi.string()
      .pattern(urlPattern) // регулярное выражение для ссылки (импортируемое)
      .default('https://i.pinimg.com/originals/99/28/5c/99285cf001991937165a765f2279316b.jpg')
      .messages({ 'string.pattern.base': 'Invalid URL' }) // замена дефолтного сообщения для ошибки string.pattern.base - ошибка паттерна
      .required(),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.length': 'Incorrect id',
        'string.hex': 'Incorrect id',
      }), // кастомные сообщения об ошибках
  }),
}), deleteCardById);

router.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.length': 'Incorrect id',
        'string.hex': 'Incorrect id',
      }), // кастомные сообщения об ошибках
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .messages({
        'string.length': 'Incorrect id',
        'string.hex': 'Incorrect id',
      }), // кастомные сообщения об ошибках
  }),
}), dislikeCard);

module.exports = router;
