const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new NotFoundError('Нет данных');
      }

      res.send({ data: users });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const token = req.cookies.jwt;
  const userId = jwt.decode(token)._id;

  if (!userId.match(/^[\w\d]{24}$/i)) {
    throw new BadRequestError('Переданы некорректные данные');
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет данных');
      }

      res.send({ data: user });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  if (!userId.match(/^[\w\d]{24}$/)) {
    throw new BadRequestError('Переданы некорректные данные');
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет данных');
      }

      res.send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          if (!user) {
            throw new NotFoundError('Нет данных');
          }

          res.send({ data: user });
        })
        .catch(next);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (!userId.match(/^[\w\d]{24}$/)) {
    throw new BadRequestError('Переданы некорректные данные');
  }

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет данных');
      }

      res.send({ data: user });
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  if (!userId.match(/^[\w\d]{24}$/)) {
    throw new BadRequestError('Переданы некорректные данные');
  }

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет данных');
      }

      res.send({ data: user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Неправильные почта или пароль');
      }

      return {
        matched: bcrypt.compare(password, user.password),
        user,
      };
    })
    .then(({ matched, user }) => {
      if (!matched) {
        throw new NotFoundError('Неправильные почта или пароль');
      }

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: 3600 },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      })
        .end();
    })
    .catch(next);
};

module.exports = {
  login,
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
