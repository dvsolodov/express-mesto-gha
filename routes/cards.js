const express = require('express');
const { getCards, deleteCard, createCard } = require('../controllers/cards');

const router = express.Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);

module.exports = router;
