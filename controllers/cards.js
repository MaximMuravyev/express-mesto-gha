const Card = require('../models/card');

module.exports.getCards = async (req, res) => {
  const cards = await Card.find({});
  res.send(cards);
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.send({ newCard }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(new Error('Не удалось найти карточку'))
    .then(() => res.send({ message: 'Удалено!' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } if {
        res.status(404).send({ message: 'Не удалось найти карточку' });
      }
      return res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Не удалось найти карточку'))
    .then((card) => res.send({ likes: card.likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } if {
        res.status(404).send({ message: 'Не удалось найти карточку' });
      }
      return res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotFound'))
    .then((card) => res.send({ likes: card.likes }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } if {
        res.status(404).send({ message: 'Не удалось найти карточку' });
      }
      return res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};