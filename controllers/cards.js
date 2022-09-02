const Cards = require('../models/cards');

const InvalidDataError = require('../errors/InvalidDataError');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ForbiddenError = require('../errors/DefaultError');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch(() => next({ message: 'Произошла ошибка' }));
};

module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  Cards.create({ name, link, owner })
    .then((Card) => res.send({ Card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Карточка не найдена'));
      } else if (card.owner.toString() === req.user) {
        Cards.findByIdAndDelete(req.params.cardId)
          .then(() => {
            res.send(card);
          });
      } else {
        next(new ForbiddenError('Недостаточно прав'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next({ message: 'Произошла ошибка' });
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
        next(new ErrorNotFound('Карточка не найдена'));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next({ message: 'Произошла ошибка' });
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
        next(new ErrorNotFound('Карточка не найдена'));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InvalidDataError('Некорректные данные'));
      } else {
        next({ message: 'Произошла ошибка' });
      }
    });
};
