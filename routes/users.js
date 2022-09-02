const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { urlCorrect } = require('../config/url-config');

const {
  getAllUsers,
  getByIdUser,
  getMyUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers);
router.get('/users/me', getMyUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string()
      .hex()
      .length(24)
      .required(),
  }),
}), getByIdUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .required(),
    about: Joi.string()
      .min(2)
      .max(30)
      .required(),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .custom(urlCorrect)
      .required(),
  }),
}), updateAvatar);

module.exports = router;
