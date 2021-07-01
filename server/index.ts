import express from 'express';
import cors from 'cors';
import { default as sockets } from './sockets';
const schedule = require('node-schedule');
const { cleanUpExpiredRooms } = require('./room-manager');

const app = express();
const server = require("http").createServer(app);

app.use(cors());
sockets(server);

app.get('/', (req, res) => {
  res.send("Serving for app deployed at https://cah-webgame.web.app")
});

const cleanRooms = schedule.scheduleJob('0 */2 * * *', () => {
  console.log('cleaning...');
  cleanUpExpiredRooms();
});



const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
