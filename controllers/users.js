const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { handleErrors } = require('../utils/utils');
const { ERR_400, ERR_401, ERR_404 } = require('../utils/constants');
const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(ERR_404).send({ message: 'Данные не найдены' });

        return;
      }

      res.send({ data: users });
    })
    .catch((err) => handleErrors(err, res));
};

const getUserById = (req, res) => {
  const { userId } = req.params;

  if (!userId.match(/^[\w\d]{24}$/)) {
    res.status(ERR_400).send({ message: 'Переданы некорректные данные' });

    return;
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(ERR_404).send({ message: 'Данные не найдены' });

        return;
      }

      res.send({ data: user });
    })
    .catch((err) => handleErrors(err, res));
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash })
    .then((user) => {
      if (!user) {
        res.status(ERR_404).send({ message: 'Данные не найдены' });

        return;
      }

      res.send({ data: user });
    })
    .catch((err) => handleErrors(err, res));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (!userId.match(/^[\w\d]{24}$/)) {
    res.status(ERR_400).send({ message: 'Переданы некорректные данные' });

    return;
  }

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERR_404).send({ message: 'Данные не найдены' });

        return;
      }

      res.send({ data: user });
    })
    .catch((err) => handleErrors(err, res));
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  if (!userId.match(/^[\w\d]{24}$/)) {
    res.status(ERR_400).send({ message: 'Переданы некорректные данные' });

    return;
  }

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        res.status(ERR_404).send({ message: 'Данные не найдены' });

        return;
      }

      res.send({ data: user });
    })
    .catch((err) => handleErrors(err, res));
};

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(ERR_401).send({ message: 'Неправильные почта или пароль' });

        return;
      }

      return {
        matched: bcrypt.compare(password, user.password),
        user,
      };
    })
    .then(({ matched, user }) => {
      if (!matched) {
        res.status(ERR_401).send({ message: 'Неправильные почта или пароль' });

        return;
      }

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: 3600 }
      );
      res
      .cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true
      })
      .end();
    });
}

module.exports = {
  login,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
