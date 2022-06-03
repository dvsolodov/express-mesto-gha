const express = require('express');
const {
  getUsers,
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const router = express.Router();

router.get('/', getUsers);
router.get('/me', getUser);
router.patch('/me/avatar', updateAvatar);
router.patch('/me', updateUser);
router.get('/:userId', getUserById);

module.exports = router;
