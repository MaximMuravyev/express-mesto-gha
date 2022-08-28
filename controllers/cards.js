const Cards = require('../models/cards');
const InvalidDataError = require('../errors/InvalidDataError');
const ErrorNotFound = require('../errors/ErrorNotFound');
const DefaultError = require('../errors/DefaultError');

module.exports.getCard = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(DefaultError).send({ message: 'Ошибка', err }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((Card) => res.send({ Card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(InvalidDataError).send({ message: 'Некорректные данные' });
      } else {
        res.status(DefaultError).send({ message: 'Ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('Что-то пошло не так'))
    .then(() => res.send({ message: 'Удалено!' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(InvalidDataError).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Что-то пошло не так') {
        res.status(ErrorNotFound).send({ message: 'Не удалось найти карточку' });
      } else {
        res.status(DefaultError).send({ message: 'Ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Что-то пошло не так'))
    .then((card) => res.send({ likes: card.likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(InvalidDataError).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Что-то пошло не так') {
        res.status(ErrorNotFound).send({ message: 'Не удалось найти карточку' });
      } else {
        res.status(DefaultError).send({ message: 'Ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Что-то пошло не так'))
    .then((card) => res.send({ likes: card.likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(InvalidDataError).send({ message: 'Некорректные данные' });
      } else if (err.message === 'Что-то пошло не так') {
        res.status(ErrorNotFound).send({ message: 'Не удалось найти карточку' });
      } else {
        res.status(DefaultError).send({ message: 'Ошибка' });
      }
    });
};
