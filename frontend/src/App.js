// import './App.css'
// import React, {  useEffect, useState } from "react"
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Axios from 'axios'

// import LoginSignup from './components/LoginSignup/LoginSignup';
//  import Home from './components/HomePage/home';
// //import WordleGame from './components/WordleGame/Wordlegame';
// // import LoginSignup from './components/LoginSignup'

// function App(){

 
//   return(
//     <Router>
//     <Routes>
//       <Route path="/" element={<LoginSignup />} />
//       <Route path="/home" element={<Home />} />

//     </Routes>
//   </Router>
//   )
// }
// export default App;
//---------------------------------------------
// App.js (React Frontend)

import './App.css';
import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginSignup from './components/LoginSignup/LoginSignup';
import Home from './components/HomePage/home';

// function App() {
//   const [data, setData] = useState('');

//   // Function to get data from the API
//   const getData = async () => {
//     try {
//       const response = await Axios.get('http://localhost:8000/api/post');
//       setData(response.data.message); // Assuming the response is like { message: "Hello from server!" }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []); // Empty dependency array to run once when the co mponent mounts

//   return (
//     <Router>
//       <div className="App">
//         <h1>{data}</h1> {/* This will show the data fetched from the backend */}

//         <Routes>
//           <Route path="/" element={<LoginSignup />} />
//           <Route path="/home" element={<Home />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
//--------------------------------------------------------------------
function App() {
  const [data, setData] = useState('');  // State to store fetched data
  const [error, setError] = useState(''); // State to store any error messages

  // Function to get data from the backend
  const getData = async () => {
    try {
      // Send GET request to the backend to fetch data from /api/post
      const response = await Axios.get('http://localhost:8000/api/post');
      setData(response.data.message);  // Assuming the response is { message: "Hello from the server!" }
      setError('');  // Reset error if data is fetched successfully
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Failed to fetch data from the server.'); // Set error message
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getData();  // Call the function to fetch data
  }, []);  // Empty dependency array means this runs only once when the component mounts

  return (
    <Router>
      <div className="App">
        {error ? (
          <div className="error-message">{error}</div>  // Display error if any
        ) : (
          <h1>{data}</h1>  // Display the fetched data
        )}

        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;