const GameSession = require('../models/gameSession');
const User = require('../models/User');  // Import User model

//const WORD_LIST = ['brave', 'crane', 'drive', 'eagle', 'hello'];
const Dictionary = require('../library/dictionary');

// Start a new game for the logged-in user
//Individual start game
exports.startNewGame = async (userId) => {
    //const targetWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    //const session = new GameSession( {targetWord} );
    const targetWord = Dictionary.realDictionary[Math.floor(Math.random() * Dictionary.realDictionary.length)];
    const session = new GameSession({ targetWord, userId }) // Associate the game session with the user
    return await session.save();
}

// Process guess for an ongoing game session
// individual process user guess
// Full word with each index position
exports.processGuess = async (sessionId, guess) => {
  const session = await GameSession.findById(sessionId);
  if (!session) throw new Error('Invalid or completed game session');

  // Check if the session is already complete and the target word was guessed correctly
  if (session.isComplete && guess === session.targetWord) {
    return { message: 'Word already guessed correctly in this session!', isComplete: true };
  }

  if (session.isComplete) {
    throw new Error('Game session is already completed');
  }

  if (guess.length !== session.targetWord.length) {
    throw new Error('Guess length must match target word length');
  }

  const targetWordArray = session.targetWord.split('');
  const guessArray = guess.split('');

  // const result = guessArray.map((letter, index) => {
  //   if (letter === targetWordArray[index]) {
  //     return { letter, status: 'correct-position' }; // Condition 1: Correct letter and position
  //   } else if (targetWordArray.includes(letter)) {
  //     return { letter, status: 'wrong-position' }; // Condition 2: Correct letter but wrong position
  //   } else {
  //     return { letter, status: 'not-in-word' }; // Condition 3: Letter not in target word
  //   }
  // });

  const result = [];
  const targetLetterCounts = {};  // To count letters in target word
  const guessMatchFlags = Array(guessArray.length).fill(false);  // Flags for matched guess letters
  const targetMatchFlags = Array(targetWordArray.length).fill(false);  // Flags for matched target letters

  // Initialize letter counts for the target word
  targetWordArray.forEach(letter => {
    targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
  });

  // Pass 1: Find and mark correct positions (correct-position)
  guessArray.forEach((letter, index) => {
    if (letter === targetWordArray[index]) {
      result[index] = { letter, status: 'correct-position' };
      guessMatchFlags[index] = true;
      targetMatchFlags[index] = true;
      targetLetterCounts[letter] -= 1;
    }
  });

  // Pass 2: Find and mark wrong positions (wrong-position) and not-in-word
  guessArray.forEach((letter, index) => {
    if (!guessMatchFlags[index]) { // Only check if not already matched
      if (targetWordArray.includes(letter) && targetLetterCounts[letter] > 0) {
        // If letter exists in target and has not been fully matched
        const wrongPositionIndex = targetWordArray.findIndex(
          (targetLetter, targetIndex) => targetLetter === letter && !targetMatchFlags[targetIndex]
        );

        if (wrongPositionIndex !== -1) {
          result[index] = { letter, status: 'wrong-position' };
          targetMatchFlags[wrongPositionIndex] = true;
          targetLetterCounts[letter] -= 1;
        } else {
          result[index] = { letter, status: 'not-in-word' };
        }
      } else {
        result[index] = { letter, status: 'not-in-word' };
      }
    }
  });

  // Update session with the guess and attempt count
  session.guesses.push({ guess, result });
  session.attempts -= 1;

  // Check win/loss conditions
  if (guess === session.targetWord) {
    session.isComplete = true;
    await session.save();
    return { message: 'Correct! You win!', isComplete: true, result };
  }

  // If no attempts remain, end the game
  if (session.attempts === 0) {
    session.isComplete = true;
    await session.save();
    return { message: 'Out of attempts! You lose.', isComplete: true, result };
  }

  await session.save();
  return { message: 'Incorrect guess. Try again.', isComplete: false, result };
};















// function checkCorrectPosition(targetWordArray, guessLetter, currentProgress) {
//     let feedback = [];
//     targetWordArray.forEach((letter, index) => {
//         if (letter === guessLetter && currentProgress[index] === '_') {
//             feedback.push(`Letter "${guessLetter}" is correct at position ${index + 1}.`);
//             currentProgress[index] = guessLetter;  // Update progress
//         }
//     });
//     return feedback.length > 0 ? feedback.join(' ') : null;
// }

// function checkWrongPosition(targetWordArray, guessLetter) {
//     let feedback = [];
//     targetWordArray.forEach((letter, index) => {
//         if (letter === guessLetter) {
//             // Letter exists but in the wrong position
//             feedback.push(`Letter "${guessLetter}" is in the word but in a different position.`);
//         }
//     });
//     return feedback.length > 0 ? feedback.join(' ') : null;
// }

//module.exports = { checkCorrectPosition, checkWrongPosition, processGuess }
// // Helper function to check if the guess letter is in the correct position(s)
// const checkCorrectPosition = (targetWordArray, guessLetter, currentProgress) => {
//     let feedback = '';
    
//     // Loop through the target word to check if any letter matches the guessed letter in the exact position
//     targetWordArray.forEach((letter, index) => {
//         if (letter === guessLetter && currentProgress[index] !== guessLetter) {
//             feedback += `Letter "${guessLetter}" is correct at position ${index + 1}. `;
//             currentProgress[index] = guessLetter; // Update current progress to reflect correct guess
//         }
//     });
    
//     return feedback ? feedback : null;
// };

// // Helper function to check if the guess letter is present but in the wrong position
// const checkWrongPosition = (targetWordArray, guessLetter) => {
//     let feedback = '';
    
//     // Check if the guessed letter is in the target word but not in the exact position
//     if (targetWordArray.includes(guessLetter)) {
//         feedback = `Letter "${guessLetter}" is in the word but in a different position. `;
//     }
    
//     return feedback ? feedback : null;
// };

// const mongoose = require('mongoose');
// const validSessionId = new mongoose.Types.ObjectId();
// //await gameService.processGuess(validSessionId, 'guessValue');
// // In gameService.js

// async function processGuess(sessionId, guessLetter) {
//     //const { ObjectId } = mongoose.Types;

//     if (!ObjectId.isValid(sessionId)) {
//         throw new Error('Invalid sessionId');
//     }

//     const session = await GameSession.findById(sessionId);
//     if (!session || session.isComplete) throw new Error('Invalid or completed game session');

//     const targetWordArray = session.targetWord.split('');
//     let currentProgress = session.currentProgress || Array(targetWordArray.length).fill('_'); // Initialize progress if not already

//     // Avoid duplicate guesses
//     const previousGuesses = session.guessedLetters || [];
//     if (previousGuesses.includes(guessLetter)) {
//         return { message: 'You have already guessed this letter.', isComplete: false, currentProgress };
//     }

//     let feedback = null;
//     feedback = checkCorrectPosition(targetWordArray, guessLetter, currentProgress);
//     if (feedback) {
//         session.guessedLetters.push(guessLetter);
//         await session.save();
//         return { message: feedback, isComplete: false, currentProgress };
//     }

//     feedback = checkWrongPosition(targetWordArray, guessLetter);
//     if (feedback) {
//         session.guessedLetters.push(guessLetter);
//         await session.save();
//         return { message: feedback, isComplete: false, currentProgress };
//     }

//     // If guess is incorrect
//     feedback = 'Incorrect guess. Try again.';
//     session.guessedLetters.push(guessLetter);
//     await session.save();
//     return { message: feedback, isComplete: false, currentProgress };
// }

// async function processFullWordGuess(sessionId, guess) {
//     const session = await GameSession.findById(sessionId);
//     if (!session || session.isComplete) throw new Error('Invalid or completed game session');

//     if (guess.length !== session.targetWord.length) {
//         throw new Error('Guess length must match target word length');
//     }

//     if (guess === session.targetWord) {
//         session.isComplete = true;
//         await session.save();
//         return { message: 'Correct! You win!', isComplete: true, currentProgress: session.targetWord };
//     }

//     session.attempts -= 1;
//     if (session.attempts === 0) {
//         session.isComplete = true;
//         await session.save();
//         return { message: 'Out of attempts! You lose.', isComplete: true, currentProgress: session.targetWord };
//     }

//     await session.save();
//     return { message: 'Incorrect guess. Try again.', isComplete: false, currentProgress: session.currentProgress };
// }


// function checkCorrectPosition(targetWordArray, guessLetter, currentProgress) {
//     let feedback = '';
//     targetWordArray.forEach((letter, index) => {
//         if (letter === guessLetter && currentProgress[index] === '_') {
//             feedback += `Letter "${guessLetter}" is correct at position ${index + 1}. `;
//             currentProgress[index] = guessLetter;
//         }
//     });
//     return feedback || null;
// }

// function checkWrongPosition(targetWordArray, guessLetter) {
//     let feedback = '';
//     targetWordArray.forEach((letter, index) => {
//         if (letter === guessLetter) {
//             feedback = `Letter "${guessLetter}" is in the word but in a different position. `;
//         }
//     });
//     return feedback || null;
// }


// Refactored processGuess to call these helper functions
// exports.processGuess = async (sessionId, guessLetter) => {
//     // Retrieve the target word, current progress, and other session-related data
//     const sessionData = await getSessionData(sessionId);
//     const targetWordArray = sessionData.targetWord.split('');
//     let currentProgress = sessionData.currentProgress.split(''); // assuming current progress is stored as a string
    
//     let feedback = '';

//     // Check if guessed letter is in the target word
//     if (targetWordArray.includes(guessLetter)) {
//         // Use helper functions to get feedback for correct or wrong positions
//         const correctPosFeedback = checkCorrectPosition(targetWordArray, guessLetter, currentProgress);
//         const wrongPosFeedback = checkWrongPosition(targetWordArray, guessLetter);

//         feedback = correctPosFeedback || wrongPosFeedback; // Prioritize correct position feedback if available
//     } else {
//         feedback = 'Incorrect guess. Try again.';
//     }

//     // Update the session with the new progress and feedback
//     await updateSessionData(sessionId, {
//         currentProgress: currentProgress.join(''),
//         feedback: feedback
//     });

//     return feedback;
// };

// // Mock functions to represent database/session operations
// async function getSessionData(sessionId) {
//     // Placeholder for retrieving session data (should retrieve target word, progress, etc.)
//     return {
//         targetWord: "example",
//         currentProgress: "_______"
//     };
// }

// // Example of how to define getCurrentProgress
// function getCurrentProgress(sessionId) {
//     // Retrieve the current progress of the game based on the sessionId
//     // This could involve fetching data from a session or a database
//     // For example:
//     const progress = gameSessions[sessionId]; // Assuming you have some kind of store for sessions
//     return progress || [];
// }

// async function updateSessionData(sessionId, data) {
//     // Placeholder for updating session data in storage
//     console.log(`Updated session ${sessionId} with data:`, data);
// }

// services/gameService.js

// exports.processGuess = async (sessionId, guessLetter) => {
//     const session = await GameSession.findById(sessionId);
//     if (!session || session.isComplete) throw new Error('Invalid or completed game session');
  
//     if (guessLetter.length !== 1) {
//       throw new Error('Please guess one letter at a time');
//     }
  
//     const targetWordArray = session.targetWord.split('');
//     const currentProgress = session.currentProgress || Array(targetWordArray.length).fill(null); // Initialize or retrieve the progress array
    
//     let feedback = '';
    
//     if (targetWordArray.includes(guessLetter)) {
//       const correctPositions = [];
//       let foundCorrectPosition = false;
//       let foundWrongPosition = false;
  
//       // Check each position in targetWordArray for the guessed letter
//       targetWordArray.forEach((letter, index) => {
//         if (letter === guessLetter) {
//           if (currentProgress[index] === null) { // Check if this position was guessed already
//             currentProgress[index] = guessLetter;
//             if (index === targetWordArray.indexOf(guessLetter)) {
//               foundCorrectPosition = true;
//             } else {
//               foundWrongPosition = true;
//             }
//           }
//         }
//       });
  
//       if (foundCorrectPosition) {
//         feedback = 'Correct guess and correct position';
//       } else if (foundWrongPosition) {
//         feedback = 'Correct guess but wrong position';
//       }
  
//     } else {
//       feedback = 'Incorrect guess. Try again';
//     }
  
//     session.guesses.push({ guess: guessLetter, feedback, currentProgress });
//     session.attempts -= 1;
//     session.currentProgress = currentProgress;
  
//     if (currentProgress.join('') === session.targetWord) {
//       session.isComplete = true;
//       await session.save();
//       return { message: 'Correct! You win!', isComplete: true, currentProgress };
//     }
  
//     if (session.attempts === 0) {
//       session.isComplete = true;
//       await session.save();
//       return { message: 'Out of attempts! You lose.', isComplete: true, currentProgress };
//     }
  
//     await session.save();
//     return { message: feedback, isComplete: false, currentProgress };
// };
  

//Each letter, not working for second time
// services/gameService.js
// exports.processGuess = async (sessionId, guessedLetter) => {
//     const session = await GameSession.findById(sessionId);
//     if (!session || session.isComplete) throw new Error('Invalid or completed game session');
  
//     const targetWordArray = session.targetWord.split('');
//     const currentGuessState = session.guessedLetters.map(g => g.letter);
  
//     // Check if letter has been guessed already
//     if (currentGuessState.includes(guessedLetter)) {
//       return { message: 'Letter already guessed', isComplete: false, guessedLetters: session.guessedLetters };
//     }
  
//     let status;
//     const index = targetWordArray.indexOf(guessedLetter);
  
//     if (index !== -1) {
//       if (guessedLetter === targetWordArray[currentGuessState.length]) {
//         status = 'correct-position';  // Correct letter and position
//       } else {
//         status = 'wrong-position';  // Correct letter but wrong position
//       }
//     } else {
//       status = 'not-in-word';  // Letter not in target word
//     }
  
//     // Update guessed letters with the result
//     session.guessedLetters.push({ letter: guessedLetter, status });
//     session.attempts -= 1;
  
//     // Check if all letters have been correctly guessed in sequence
//     const guessedSoFar = session.guessedLetters.map(g => g.letter).join('');
//     if (guessedSoFar === session.targetWord) {
//       session.isComplete = true;
//       await session.save();
//       return { message: 'Correct! You win!', isComplete: true, guessedLetters: session.guessedLetters };
//     }
  
//     // Check if attempts are exhausted
//     if (session.attempts === 0) {
//       session.isComplete = true;
//       await session.save();
//       return { message: 'Out of attempts! You lose.', isComplete: true, guessedLetters: session.guessedLetters };
//     }
  
//     await session.save();
//     return { message: 'Guess recorded', isComplete: false, guessedLetters: session.guessedLetters };
// };
  

//Full word guess: Working
// exports.processGuess = async (sessionId, guess) => {
//     const session = await GameSession.findById(sessionId);
//     if(!session || session.isComplete) throw new Error('Invalid or completed game session')

//     session.guesses.push(guess);
//     session.attempts = session.attempts - 1;

//     if(guess === session.targetWord) {
//         session.isComplete = true;
//         await session.save();
//         return { message: 'Correct! You win!', isComplete: true };
//     }

//     if(session.attempts === 0) {
//         session.isComplete = true;
//         await session.save();
//         return { message: 'Out of attempts! You lose.', isComplete: true }
//     }

//     await session.save();
//     return { message: 'Incorrect guess. Try again.', isComplete: false }
// }