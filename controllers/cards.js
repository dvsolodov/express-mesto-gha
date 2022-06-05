const jwt = require('jsonwebtoken');
const Card = require('../models/card');
const { handleErrors } = require('../utils/utils');
const { ERR_400, ERR_404 } = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        res.status(ERR_404).send({ message: 'Данные не найдены' });

        return;
      }

      res.send({ data: cards });
    })
    .catch((err) => handleErrors(err, res));
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  const token = req.cookies.jwt;
  const userId = jwt.decode(token)._id;

  if (!cardId.match(/^[\w\d]{24}$/) || !userId.match(/^[\w\d]{24}$/i)) {
    res.status(ERR_400).send({ message: 'Переданы некорректные данные' });

    return;
  }

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card || card.owner !== userId) {
        res.status(ERR_404).send({ message: 'Данные не найдены' });

        return;
      }

      res.send({ data: card });
      res.end();
    })
    .catch((err) => handleErrors(err, res));
};

const createCard = (req, res) => {
  const {
    name, link, owner = req.user._id, likes, createdAt = new Date(),
  } = req.body;

  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => {
      if (!card) {
        res.status(ERR_404).send({ message: 'Данные не найдены' });

        return;
      }

      res.send({ data: card });
    })
    .catch((err) => handleErrors(err, res));
};

const likeCard = (req, res) => {
  const { cardId } = req.params;

  if (!cardId.match(/^[\w\d]{24}$/)) {
    res.status(ERR_400).send({ message: 'Переданы некорректные данные' });

    return;
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERR_404).send({ message: 'Данные не найдены' });

        return;
      }

      res.send({ data: card });
    })
    .catch((err) => handleErrors(err, res));
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;

  if (!cardId.match(/^[\w\d]{24}$/)) {
    res.status(ERR_400).send({ message: 'Переданы некорректные данные' });

    return;
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERR_404).send({ message: 'Данные не найдены' });

        return;
      }

      res.send({ data: card });
    })
    .catch((err) => handleErrors(err, res));
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
