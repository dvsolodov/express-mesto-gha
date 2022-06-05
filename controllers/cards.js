const jwt = require('jsonwebtoken');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Нет данных');
      }

      res.send({ data: cards });
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const token = req.cookies.jwt;
  const userId = jwt.decode(token)._id;

  if (!cardId.match(/^[\w\d]{24}$/) || !userId.match(/^[\w\d]{24}$/i)) {
    throw new BadRequestError('Переданы некорректные данные');
  }

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card || card.owner !== userId) {
        throw new NotFoundError('Нет данных');
      }

      res.send({ data: card });
      res.end();
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const {
    name, link, owner = req.user._id, likes, createdAt = new Date(),
  } = req.body;

  Card.create({
    name, link, owner, likes, createdAt,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет данных');
      }

      res.send({ data: card });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  if (!cardId.match(/^[\w\d]{24}$/)) {
    throw new BadRequestError('Переданы некорректные данные');
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет данных');
      }

      res.send({ data: card });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  if (!cardId.match(/^[\w\d]{24}$/)) {
    throw new BadRequestError('Переданы некорректные данные');
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет данных');
      }

      res.send({ data: card });
    })
    .catch(next);
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
