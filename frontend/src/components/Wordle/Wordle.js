import React, { useEffect, useState } from "react";
// import useWordle from "../hooks/useWordle";
import Grid from "../Grid/Grid";
import Keypad from "../Keypad/Keypad";
import Modal from "../Modal/Modal";
import useWordle from "../hooks/useWordle/useWordle";

// components
// import Grid from "./Grid";
// import Keypad from "./Keypad";
// import Modal from "./Modal";
// ...........
export default function Wordle({ solution }) {
  const { currentGuess, guesses, turn, isCorrect, usedKeys, handleKeyup } =
    useWordle(solution);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    if (isCorrect) {
      setTimeout(() => setShowModal(true), 2000);
      window.removeEventListener("keyup", handleKeyup);
    }
    if (turn > 5) {
      setTimeout(() => setShowModal(true), 2000);
      window.removeEventListener("keyup", handleKeyup);
    }

    return () => window.removeEventListener("keyup", handleKeyup);
  }, [handleKeyup, isCorrect, turn]);

  return (
    <div>
      <Grid guesses={guesses} currentGuess={currentGuess} turn={turn} />
      <Keypad usedKeys={usedKeys} />
      {showModal && (
        <Modal isCorrect={isCorrect} turn={turn} solution={solution} />
      )}
    </div>
  );
}
//.......*

// export default function Wordle({ solution, currentGuess, attempts, usedKeys, onSubmit, gameOver }) {
//     const { currentguess, guesses, turn, isCorrect, handleKeyup } = useWordle(solution);
  
//     const handleKeyPress = (letter) => {
//       if (currentGuess.length < 5 && !gameOver) {
//         setCurrentGuess((prevGuess) => prevGuess + letter);
//       }
//     };
  
//     return (
//       <div>
//         <Grid guesses={guesses} currentguess={currentguess} turn={turn} />
//         <Keypad usedKeys={usedKeys} onKeyPress={handleKeyPress} />
//         {gameOver && (
//           <Modal
//             isCorrect={isCorrect}
//             solution={solution}
//             turn={attempts}
//             onRestart={handleRestart} // Ensure you implement the restart logic
//           />
//         )}
//       </div>
//     );
//   }