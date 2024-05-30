import users from './server/routes/users.js';
import express from 'express';
import swagger from './swagger.js';
import mongoose from 'mongodb';
import cors from 'cors';
import cars from './server/routes/cars.js';
import favorities from './server/routes/favorities.js'
import chats from './server/routes/chats.js';
import messages from './server/routes/messages.js';
import path from 'path';
import reservation from './server/routes/reservation.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs/api', swagger.serve, swagger.setup);
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" href="/public/easlycarslogo2.ico">
      <title>EaslyCars</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background-color: #f4f4f4;
          }
          .message-container {
              text-align: center;
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .message-container h1 {
              margin: 0;
              font-size: 24px;
              color: #333;
          }
      </style>
  </head>
  <body>
      <div class="message-container">
          <h1>EaslyCars Server</h1>
      </div>
  </body>
  </html>
`);
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
  const filePath = path.join(process.cwd(), 'uploads', fileName); // Adjust the path here
  res.sendFile(filePath);
});

// Serve static files from the 'userphoto' directory
app.get('/userphoto/:file', (req, res) => {
  const fileName = req.params.file;
  const filePath = path.join(process.cwd(), 'userphoto', fileName); // Adjust the path here
  res.sendFile(filePath);
});
const port = 4000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
