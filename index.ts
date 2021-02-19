import express from 'express';
import cors from 'cors';
import { default as sockets } from './sockets';

const app = express();
const server = require("http").createServer(app);

app.use(cors());
sockets(server);

app.get('/', (req, res) => {
  res.send("Serving for app deployed at https://cah-webgame.firebaseapp.com/")
});


const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
