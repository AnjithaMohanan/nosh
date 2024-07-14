const express = require('express');
const mongoose = require('mongoose');
const dotenv=require('dotenv')
const dishRoutes=require('./routes/dishRoutes')
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const mongoString = process.env.MONGO_URI;


mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;

database.on('error', (error) => {
  console.error('MongoDB Connection Error:', error);
});

database.once('connected', async () => {
  console.log('Database Connected');
});

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    req.io = io;
    next();
  });
  

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

app.use('/api',dishRoutes)

app.listen(5000, () => {
    console.log("server is running  ");
  });

