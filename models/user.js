const mongoose = require('mongoose');

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
        return /^(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([/\w-]*)*\/?$/.test(v);
      },
      message: (props) => `${props.value} не соответствует формату URL!`,
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    validate: {
      validator(v) {
        return /^[a-z0-9_-]+@[a-z0-9_-]+\.[a-z]{2,6}$/.test(v);
      },
      message: (props) => `${props.value} не соответствует формату адреса электронной почты!`,
    },
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
