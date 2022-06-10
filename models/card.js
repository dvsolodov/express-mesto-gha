const mongoose = require('mongoose');
const { urlPattern } = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    validate: {
      validator(v) {
        return urlPattern.test(v);
      },
      message: (props) => `Ссылка ${props.value} не соответствует формату URL!`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    default: '',
  },
  likes: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    defalult: new Date(),
  },
});

module.exports = mongoose.model('card', cardSchema);
