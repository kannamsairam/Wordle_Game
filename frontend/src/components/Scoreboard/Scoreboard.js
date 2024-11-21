import React from "react";

export default function Scoreboard({ attempts, score, results }) {
  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <p>Attempts: {attempts}</p>
      <p>Score: {score}</p>

      <h3>Results:</h3>
      <ul>
        {results.map((result, index) => (
          <li key={index} style={{ color: result.won ? "green" : "red" }}>
            {result.guess} - {result.won ? "Correct!" : "Incorrect!"}
          </li>
        ))}
      </ul>
    </div>
  );
}




