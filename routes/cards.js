const express = require('express');
const { getCards, deleteCard, createCard, likeCard, dislikeCard } = require('../controllers/cards');

const router = express.Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
