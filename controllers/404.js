const { ERR_404 } = require('../utils/constants');

module.exports.handle404 = (req, res) => {
  res.status(ERR_404).send({ message: 'Данные не найдены' });
};
