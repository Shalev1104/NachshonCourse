import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import express from 'express';

const app = express();
const port = process.env.PORT || 4000;
app.listen(port);

const io = new Server(createServer(app));
io.on('connection', (socket : Socket) => {

});