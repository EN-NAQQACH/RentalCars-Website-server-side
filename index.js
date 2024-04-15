import users from './server/routes/users.js';
import express from 'express';
import swagger from './swagger.js';
import mongoose from 'mongodb';



const app = express();


app.use(express.json());

app.use('/api-docs/api', swagger.serve, swagger.setup);
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use("/api",users)


app.listen(5600, () => {
  console.log(`Server is running on port 5500`);
});
