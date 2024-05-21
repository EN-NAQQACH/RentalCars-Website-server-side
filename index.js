import users from './server/routes/users.js';
import express from 'express';
import swagger from './swagger.js';
import mongoose from 'mongodb';
import cors from 'cors';
import cars from './server/routes/cars.js';
import favorities from './server/routes/favorities.js'
import chats from './server/routes/chats.js';
import messages from './server/routes/messages.js';
import reservation from './server/routes/reservation.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs/api', swagger.serve, swagger.setup);
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use("/api", users);
app.use("/api", cars);
app.use("/api", favorities)
app.use("/api", chats)
app.use("/api", messages)
app.use("/api", reservation)
// app.use('/uploads', express.static('uploads'));
// app.use('/userphoto', express.static('userphoto'));
// app.use('/uploads', express.static('.vercel/output/static/uploads'));
// app.use('/userphoto', express.static('.vercel/output/static/userphoto'));
app.get('/uploads/:file', (req, res) => {
  const fileName = req.params.file;
  res.sendFile(`${__dirname}/.vercel/output/static/uploads/${fileName}`);
});

// Serve static files from the 'userphoto' directory
app.get('/userphoto/:file', (req, res) => {
  const fileName = req.params.file;
  res.sendFile(`${__dirname}/.vercel/output/static/userphoto/${fileName}`);
});
app.listen(5600, () => {
  console.log(`Server is running on port 5500`);
});
