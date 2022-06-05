module.exports.handle404 = (req, res) => {
  res.status(404).send({ message: 'Данные не найдены' });
};
