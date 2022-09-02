const Cards = require('../models/cards');

const InvalidDataError = require('../errors/InvalidDataError');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ForbiddenError = require('../errors/DefaultError');

module.exports.getCard = async (req, res, next) => {
  await Cards.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((Card) => res.send({ Card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorNotFound('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new InvalidDataError('Карточка не найдена'); // проверяем её существование
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет доступа'); // проверяем, является ли текущий пользователь владельцем карточки
      }
      return card.delete(); // в случае успеха удаляем карточку
    })
    .then(() => res.send({ message: 'Удалено' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorNotFound('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new InvalidDataError('Карточка не найдена');
      }
      res.send({ likes: card.likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorNotFound('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new InvalidDataError('Карточка не найдена');
      }
      res.send({ likes: card.likes });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorNotFound('Некорректные данные'));
      } else {
        next(err);
      }
    });
};
