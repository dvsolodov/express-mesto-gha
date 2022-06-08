const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const {
  urlPattern,
  idPattern,
} = require('../utils/constants');

const router = express.Router();

router.get('/', getUsers);

router.get('/me', getUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlPattern),
  }),
}), updateAvatar);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().pattern(idPattern),
  }),
}), getUserById);

module.exports = router;
