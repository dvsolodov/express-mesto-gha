const express = require('express');
const { createUser, getUsers } = require('../controllers/users');

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:userId', getUsers);
router.post('/', createUser);
