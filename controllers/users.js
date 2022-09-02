const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

const InvalidDataError = require('../errors/InvalidDataError');
const ErrorNotFound = require('../errors/ErrorNotFound');
const RequestError = require('../errors/RequestError');
const AuthError = require('../errors/AuthError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error('noDataFound'))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Невалидный id'));
      } else if (err.message === 'noDataFound') {
        next(new ErrorNotFound('Пользователь с таким id не найден'));
      } else {
        next({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.getMyUser = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new ErrorNotFound('Пользователь с таким id не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Невалидный id'));
      } else {
        next({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else if (err.code === 11000) {
        next(new RequestError('пользователь с таким email уже существует'));
      } else {
        next({ message: 'Произошла ошибка' });
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
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
        })
        .send({ message: 'Авторизация успешна' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else if (err.statusCode === 401) {
        next(new AuthError('Неправильные почта или пароль'));
      } else {
        next({ message: 'Произошла ошибка' });
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
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next({ message: 'Произошла ошибка' });
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
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next({ message: 'Произошла ошибка' });
      }
    });
};
