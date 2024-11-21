//--------------------------

//-----
// import React from "react";
// import { Link } from "react-router-dom";

// export default function Modal({ isCorrect, solution, turn, onRestart }) {
//   return (
//     <div className="modal">
//       {isCorrect ? (
//         <div>
//           <h1>You Win!</h1>
//           <p className="solution">{solution}</p>
//           <p>You found the solution in {turn} guesses :)</p>
//           <Link to="/">Restart Game</Link>

//           {/* Consider removing the Link to avoid confusion */}
//         </div>
//       ) : (
//         <div>
//           <h1>You Lost!</h1>
//           <p className="solution">The answer was: {solution}</p>
//           <p>Better luck next time :)</p>

//           <Link to="/"> New Game</Link>
//           <br/>
//           <Link to="/scoreboard">Scoreboard</Link>
//         </div>
//       )}
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Modal({ isCorrect, solution, turn, onRestart }) {
  const navigate = useNavigate();
  const handleRestart = () => {
    onRestart(); // Reset the game state
    navigate("/"); // Navigate to the home page
  };
  return (
    <div className="modal">
      {isCorrect ? (
        <div>
          <h1 style={{ color: "red" }}>Scoreboard</h1>
          <h1>You Win!</h1>
          <p className="solution">{solution}</p>
          <p>You found the solution in {turn} guesses :)</p>
          <Link to="/">Restart Game</Link>
          {/* <button onClick={onRestart}>Restart Game</button> */}
          {/* <Link to = "/">Restart Game</Link> */}
          {/* <Link to="/home">Back to Game</Link> */}
          {/* <Link to="/scoreboard">Scoreboard</Link> */}
        </div>
      ) : (
        <div>
          <h1>Scoreboard</h1>
          <h1>You Lost!</h1>
          <p className="solution">The answer was: {solution}</p>
          <p>Better luck next time :)</p>
          {/* <button onClick={onRestart}>Restart Game</button> */}
          <br />
          {/* <Link to = "/">Restart Game</Link> */}
          {/* <button>
            <Link to="/home">Back to Game</Link>
          </button> */}
          {/* <Link to="/">Restart Game</Link> */}
          <button onClick={handleRestart}>Restart Game</button>
        </div>
      )}
    </div>
  );
}
