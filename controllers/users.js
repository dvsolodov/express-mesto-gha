const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');

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
  User.findById(req.user._id)
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
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          };

          res.send(responseUser)
            .end();
        })
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError('Пользователь с такой почтой уже зарегистрирован'));
          }

          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Для регистрации переданы некорректные данные'));
          }

          return next(err);
        });
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Для регистрации переданы некорректные данные'));
      }

      return next(err);
    });
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Для регистрации переданы некорректные данные'));
      }

      return next(err);
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  await User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            console.log(matched);
            throw new UnauthorizedError('Неправильные почта или пароль');
          }

          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: 3600 },
          );

          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
          });

          res.send({ message: 'Успешный вход в систему' })
            .end();
        });
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
