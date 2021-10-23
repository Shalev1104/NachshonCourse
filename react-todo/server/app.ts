import express from 'express';
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/todos', require('./routes/todos'));
app.use('/users', require('./routes/users'));

app.listen(port,() => {
    console.log(`listening to port : ${port}`);
    
});