const User = require('../models/user');
const { handleErrors } = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(404).send({ message: 'Данные не найдены' });
      }

      res.send({ data: users });
    })
    .catch((err) => handleErrors(err, res));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  if (!userId.match(/^[\w\d]{24}$/)) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Данные не найдены' });
      }

      res.send({ data: user });
    })
    .catch((err) => handleErrors(err, res));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Данные не найдены' });
      }

      res.send({ data: user });
    })
    .catch((err) => handleErrors(err, res));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (!userId.match(/^[\w\d]{24}$/)) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Данные не найдены' });
      }

      res.send({ data: user });
    })
    .catch((err) => handleErrors(err, res));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  if (!userId.match(/^[\w\d]{24}$/)) {
    res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Данные не найдены' });
      }

      res.send({ data: user });
    })
    .catch((err) => handleErrors(err, res));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
