const express = require('express');
const { handle404 } = require('../controllers/404');

const router = express.Router();

router.get('*', handle404);
router.post('*', handle404);
router.put('*', handle404);
router.patch('*', handle404);
router.delete('*', handle404);

module.exports = router;
