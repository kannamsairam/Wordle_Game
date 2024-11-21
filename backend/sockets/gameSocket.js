const GameSession = require('../models/gameSession');
const gameService = require('../services/gameService');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('startGame', async () => {
      const session = await gameService.startNewGame();
      socket.join(session._id); // Join the socket to the game room
      socket.emit('gameStarted', { sessionId: session._id, attempts: session.attempts });
    });

    socket.on('makeGuess', async ({ sessionId, guess }) => {
      try {
        const result = await gameService.processGuess(sessionId, guess);
        io.to(sessionId).emit('guessResult', result); // Send guess result to everyone in the room
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};