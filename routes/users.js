const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const router = express.Router();
const urlPattern = /^(https?:\/\/)?([.\da-z-]+)\.([a-z]{2,6})([/\w-]*)*\/?$/;

router.get('/', getUsers);

router.get('/me', getUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(urlPattern)),
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
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

module.exports = router;
