const express = require('express');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useFindAndModify: false,
}).catch((error) => console.log(error));

app.use(bodyParser.json());
app.use('/users', userRouter);

app.listen(PORT);
