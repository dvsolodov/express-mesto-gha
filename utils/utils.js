const handleErrors = (err, res) => {
  let errCode = 500;
  let message = 'Что-то пошло не так!';

  if (err.name === 'ValidationError') {
    errCode = 400;
    message = 'Переданы некорректные данные';
  } else if (err.name === 'CastError') {
    errCode = 404;
    message = 'Данные не найдены';
  }

  res.status(errCode).send({ message });
};

module.exports = {
  handleErrors,
};
