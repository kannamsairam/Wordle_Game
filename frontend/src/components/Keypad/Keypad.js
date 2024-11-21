// import React, { useEffect, useState } from "react";

// export default function Keypad({ usedKeys }) {
//   const [letters, setLetters] = useState(null);

// //   useEffect(() => {
// //     fetch("http://localhost:3001/letters")
// //       .then((res) => res.json())
// //       .then((json) => {
// //         setLetters(json);
// //       });
// //   }, []);

//   return (
//     <div className="keypad">
//       {letters &&
//         letters.map((l) => {
//           const color = usedKeys[l.key];
//           return (
//             <div key={l.key} className={color}>
//               {l.key}
//             </div>
//           );
//         })}
//     </div>
//   );
// }

//-----------

// import React from "react";

// export default function Keypad({ usedKeys }) {
//   // Static list of letters from a-z
//   const letters = [
//     { key: "a" },
//     { key: "b" },
//     { key: "c" },
//     { key: "d" },
//     { key: "e" },
//     { key: "f" },
//     { key: "g" },
//     { key: "h" },
//     { key: "i" },
//     { key: "j" },
//     { key: "k" },
//     { key: "l" },
//     { key: "m" },
//     { key: "n" },
//     { key: "o" },
//     { key: "p" },
//     { key: "q" },
//     { key: "r" },
//     { key: "s" },
//     { key: "t" },
//     { key: "u" },
//     { key: "v" },
//     { key: "w" },
//     { key: "x" },
//     { key: "y" },
//     { key: "z" }
//   ];

//   return (
//     <div className="keypad">
//       {letters.map((l) => {
//         // Get the color from the usedKeys object for this letter
//         const color = usedKeys[l.key] || ""; // Default to empty string if no color is assigned
//         return (
//           <div
//             key={l.key}
//             className={`key ${color}`} // Add the class for color styling
//           >
//             {l.key}
//           </div>
//         );
//       })}
//     </div>
//   );
// }

//************ */
import React from "react";

export default function Keypad({ usedKeys, onKeyPress }) {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");

  return (
    <div className="keypad">
      {letters.map((letter) => {
        const color = usedKeys[letter] || ""; // Default to empty string if undefined
        return (
          <div
            key={letter}
            className={`key ${color}`}
            onClick={() => onKeyPress(letter)}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}
