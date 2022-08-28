const Cards = require('../models/cards');

module.exports.getCard = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: 'Ошибка по-умолчанию', err }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send({ newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  Cards.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('Не удалось найти карточку'))
    .then(() => res.send({ message: 'Удалено!' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: 'Не удалось найти карточку' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Не удалось найти карточку'))
    .then((card) => res.send({ likes: card.likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: 'Не удалось найти карточку' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send({ likes: card.likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: 'Не удалось найти карточку' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};
