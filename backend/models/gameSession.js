const mongoose = require('mongoose');

//For full word match
const GuessSchema = new mongoose.Schema({
    guess: { type: String, required: true },
    result: [
      {
        letter: { type: String, required: true },
        status: { type: String, enum: ['correct-position', 'wrong-position', 'not-in-word'], required: true }
      }
    ]
});

// const LetterGuessSchema = new mongoose.Schema({
//     letter: { type: String, required: true },
//     status: { type: String, enum: ['correct-position', 'wrong-position', 'not-in-word'], required: true }
// });

const GameSession = new mongoose.Schema({
    targetWord: { type: String, required: true },
    //guesses: { type: [String], default: [] },
    guesses: [GuessSchema],  // Each guess is an object with `guess` and `result` fields
    //guessedLetters: [LetterGuessSchema],  // Track each guessed letter and its status
   // guesses: [{ guess: String, feedback: String, currentProgress: [String] }],
    //guessedLetters: { type: [String], default: [] },
    currentProgress: { type: [String], default: [] }, // Holds partially guessed word
    isComplete: { type: Boolean, default: false },
    attempts: { type: Number, default: 6 },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User
});

//module.exports = mongoose.model('GameSession', GameSession);
module.exports = mongoose.model('GameSession', GameSession, 'GameSessions');
//module.exports = GameSession;
