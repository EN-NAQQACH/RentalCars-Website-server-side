import users from './server/routes/users.js';
import express from 'express';
import swagger from './swagger.js';
import mongoose from 'mongodb';
import cors from 'cors';
import cars from './server/routes/cars.js';
import favorities from './server/routes/favorities.js'
import chats from './server/routes/chats.js';
import messages  from './server/routes/messages.js';
import { Server } from 'socket.io';
const app = express();
const io = new Server({
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on('connection', (socket) => {
  console.log('socket');
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api-docs/api', swagger.serve, swagger.setup);
app.get('/', (req, res) => {
  res.send('Hello, world!');
});


app.use("/api",users);
app.use("/api", cars);
app.use("/api",favorities)
app.use("/api", chats)
app.use("/api", messages)
app.use('/uploads', express.static('uploads'));
app.use('/userphoto', express.static('userphoto'));

app.listen(5600, () => {
  console.log(`Server is running on port 5500`);
});
