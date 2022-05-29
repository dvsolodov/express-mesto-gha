const { ERR_400, ERR_404, ERR_500 } = require('./constants');

const handleErrors = (err, res) => {
  let errCode = ERR_500;
  let message = 'Что-то пошло не так!';

  if (err.name === 'ValidationError') {
    errCode = ERR_400;
    message = 'Переданы некорректные данные';
  } else if (err.name === 'CastError') {
    errCode = ERR_404;
    message = 'Данные не найдены';
  }

  res.status(errCode).send({ message });
};

module.exports = {
  handleErrors,
};
