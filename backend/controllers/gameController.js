const gameService = require('../services/gameService');

exports.startGame = async (req, res) => {
    try {
        const session = await gameService.startNewGame();
        res.json({sessionId: session._id, attempts: session.attempts });
    } catch (error) {
        res.status(500).json({ message: 'Error starting game', error });
    }
};

exports.submitGuess = async (req, res) => {
    const { sessionId, guess } = req.body;
    try {
        const result = await gameService.processGuess(sessionId, guess);
        res.json(result);
    } catch(error) {
        res.status(400).json({message: 'Error processing guess', error });
    }
}