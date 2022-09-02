const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { urlValid } = require('../config/url-config');
const {
  getAllUsers, getByIdUser, getMyUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers);

router.get('/users/me', getMyUser);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getByIdUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(urlValid),
  }),
}), updateAvatar);

module.exports = router;
