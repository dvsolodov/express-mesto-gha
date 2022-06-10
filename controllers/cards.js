const jwt = require('jsonwebtoken');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const { idPattern } = require('../utils/constants');

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

  Card.findById(cardId)
    .orFail(() => new NotFoundError('Карточка с таким ID не найдена'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Карточка с таким ID не найдена'));
      }

      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Для создания карточки переданы некорректные данные'));
      }

      return next(err);
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

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
