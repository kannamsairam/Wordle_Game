const express = require('express');
const router = express.Router();

const gameController = require('../controllers/gameController');

router.post('/start', gameController.startGame);
router.post('/guess', gameController.submitGuess);

module.exports = router;