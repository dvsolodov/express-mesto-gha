const mongoose = require('mongoose');
const {
  urlPattern,
  emailPattern,
  passwordPattern,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return urlPattern.test(v);
      },
      message: (props) => `Ссылка ${props.value} не соответствует формату URL!`,
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    validate: {
      validator(v) {
        return emailPattern.test(v);
      },
      message: (props) => `${props.value} не соответствует формату адреса электронной почты!`,
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    validate: {
      validator(v) {
        return passwordPattern.test(v);
      },
      message: (props) => `${props.value} не соответствует формату пароля!`,
    },
    required: true,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
