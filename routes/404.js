const express = require('express');
const { handle404 } = require('../controllers/404');

const router = express.Router();

router.use((req, res) => handle404(req, res));

module.exports = router;
