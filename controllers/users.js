const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const { idPattern } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (users.length === 0) {
        throw new NotFoundError('Нет данных');
      }

      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const token = req.cookies.jwt;
  const userId = jwt.decode(token)._id;

  if (!userId.match(idPattern)) {
    throw new BadRequestError('Переданы некорректные данные');
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет данных');
      }

      res.send(user);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет данных');
      }

      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create(
        {
          name, about, avatar, email, password: hash,
        },
      )
        .then((user) => {
          if (!user) {
            throw new NotFoundError('Нет данных');
          }

          const responseUser = {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          };

          res.send(responseUser)
            .end();
        })
        .catch(next);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет данных');
      }

      res.send(user)
        .end();
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет данных');
      }

      res.send(user)
        .end();
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return {
        matched: bcrypt.compare(password, user.password),
        user,
      };
    })
    .then(({ matched, user }) => {
      if (!matched) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: 3600 },
      );
      const responseUser = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      };

      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.send(responseUser)
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
