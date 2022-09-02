const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const InvalidDataError = require('../errors/InvalidDataError');
const ErrorNotFound = require('../errors/ErrorNotFound');
const RequestError = require('../errors/RequestError');
const AuthError = require('../errors/AuthError');
const User = require('../models/users');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => next({ message: 'Ошибка!' }));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('Не найдено'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректные данные'));
      } else if (err.message === 'Не найдено') {
        next(new ErrorNotFound('Некорректный id'));
      } else {
        next({ message: 'Ошибка!' });
      }
    });
};

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        next(new ErrorNotFound('Некорректный id'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next({ message: 'Ошибка!' });
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(200).send({
      name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else if (err.code === 11000) {
        next(new RequestError('Данный email уже используется'));
      } else {
        next({ message: 'Ошибка!' });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'this-is-my-secret-key',
      );
      res
        .cookie('jwt', token, { maxAge: 7 * 24 * 3600000 })
        .status(200)
        .send({ message: 'Успешно!' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else if (err.statusCode === 401) {
        next(new AuthError('Некорректный пароль или email'));
      } else {
        next({ message: 'Ошибка!' });
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next({ message: 'Ошибка!' });
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next({ message: 'Ошибка!' });
      }
    });
};
