const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('Что-то пошло не так'))
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректный id' });
      } else if (err.message === 'Что-то пошло не так') {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new Error('Что-то пошло не так'))
    .then((newData) => res.send({ newData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Что-то пошло не так') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const newAvatar = req.body.avatar;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar: newAvatar },
    { new: true, runValidators: true },
  )
    .orFail(new Error('Что-то пошло не так'))
    .then((newData) => res.send({ newData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Что-то пошло не так') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка' });
      }
    });
};
