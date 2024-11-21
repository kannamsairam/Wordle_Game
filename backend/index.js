    const express = require('express');
    const http = require('http');
    //const connectDB = require('../backend/config/database'); 

    //const socketIo = require('socket.io'); //withsocket

    const connectDB = require('./config/database');
    const gameRoutes = require('./routes/gameRoutes');
    const userRoutes = require('./routes/userRoutes'); // userRoutes

    //const gameSocket = require('./sockets/gameSocket'); //withsocket

    const app = express();
    //const server = http.createServer(app); //withsocket
    //const io = socketIo(server); //withsocket

    connectDB();
    app.use(express.json());
    app.use('/api/game', gameRoutes);
    app.use('/api/user', userRoutes);

    //gameSocket(io); //gameSocket(io); // Pass io instance to socket handler

    const PORT = process.env.PORT;
    //server.listen
    app.listen(PORT, () => console.log(`Server is running in http://localhost:${PORT}/`));



    // const express = require('express');
    // //const router = express.Router();
    // const app = express();
    // const mongoose = require('mongoose');
    // require('dotenv').config();


    // app.use(express.json());

    // const url = 'mongodb://localhost:27017/User';

    // mongoose.connect(url, {}).then(() => console.log('MongoDB Connected successfully.')).catch(() => console.log('Unable to connect database.'));

    // var routes = require();
    // app.use('/api', routes);

    // app.listen(process.env.PORT, () => {
    //     `Server is running in http://localhost:${process.env.PORT}/` 
    // });