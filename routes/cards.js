const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { urlCorrect } = require('../config/url-config');

const {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCard);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .required(),
    link: Joi.string()
      .custom(urlCorrect)
      .required(),
  }),
}), createCard);

router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .required(),
  }),
}), deleteCard);

router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .required(),
  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string()
      .hex()
      .length(24)
      .required(),
  }),
}), dislikeCard);

module.exports = router;
