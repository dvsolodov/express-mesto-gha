const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
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
