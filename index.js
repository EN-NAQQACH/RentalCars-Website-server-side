import users from './server/routes/users.js';
import express from 'express';
import swagger from './swagger.js';
import mongoose from 'mongodb';
import cors from 'cors';



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs/api', swagger.serve, swagger.setup);
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use("/api",users);


app.listen(5600, () => {
  console.log(`Server is running on port 5500`);
});
