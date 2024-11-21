// components/Scoreboard.js
//  import React from "react";

// export default function Scoreboard({ scores }) {
//   return (
//     <div className="scoreboard">
//       <h1>Scoreboard</h1>
//       {scores.length === 0 ? (
//         <p>No scores yet. Play the game!</p>
//       ) : (
//         <ul>
//           {scores.map((score, index) => (
//             <li key={index}>
//               Game {index + 1}: {score} guesses
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

//------------------333

// import React from "react";
// import { Link } from "react-router-dom";
// import styles from "./Score.module.scss";

// export default function Scoreboard({ scores }) {
//   return (
//     <div>
//       <h2 className={styles.head}>Scoreboard</h2>
//       <ul>
//         {scores.map((score, index) => (
//           <li key={index}>Score: {score}</li>
//         ))}
//       </ul>
//       <Link to="/" className={styles.btn}>
//         Restart Game
//       </Link>
//     </div>
//   );
// }
//-----
// import React from 'react';
// import  {Link} from 'react-router-dom';

// export default function Scoreboard({scores}) {
//     return(
//         <div className="modal">
//       {isCorrect ? (
//         <div>
//           <h1>You Win!</h1>
//           <p className="solution">{solution}</p>
//           <p>You found the solution in {turn} guesses :)</p>
//           {/* <button onClick={onRestart}>Restart Game</button> */}
//           {/* <Link to = "/">Restart Game</Link> */}
//           <Link to="/home">Back to Game</Link>
//           <Link to="/scoreboard">Scoreboard</Link>
//         </div>
//       ) : (
//         <div>
//           <h1>You Lost!</h1>
//           <p className="solution">The answer was: {solution}</p>
//           <p>Better luck next time :)</p>
//           {/* <button onClick={onRestart}>Restart Game</button> */}
//           <br />
//           {/* <Link to = "/">Restart Game</Link> */}
//           <button>
//             <Link to="/home">Back to Game</Link>
//           </button>
//           <Link to="/scoreboard">Scoreboard</Link>
//         </div>
//       )}
//     </div>
//     )
// }

import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Score.module.scss";

export default function Scoreboard() {
  const location = useLocation();
  const score = location.state?.score; // Get the score passed from the Modal
  const scores = []; // You will want to maintain this as a state in your main app component.

  return (
    <div>
      <h2 className={styles.head}>Scoreboard</h2>
      <ul>
        {scores.map((s, index) => (
          <li key={index}>Score: {s}%</li>
        ))}
        {score && <li>Last Game Score: {score.toFixed(2)}%</li>} {/* Display the last game score */}
      </ul>
      <Link to="/" className={styles.btn}>
        Restart Game
      </Link>
    </div>
  );
}

