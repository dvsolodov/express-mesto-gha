require('dotenv').config();
const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const Router404 = require('./routes/404');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '628b5cbd790c2e7b20a054ee',
  };

  next();
});
app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/', Router404);

app.listen(PORT);
