import express from 'express';
import cors from 'cors';
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
);

app.use('/users/:userId/todos', require('./routes/todos'));
app.use(require('./routes/oauth'))

app.listen(port,() => {
    console.log(`listening to port : ${port}`);
    
});