import express, { Response, Request} from 'express';
import cors from 'cors';
const { testUsers } = require('./room-manager');
import { Game } from "./models/game";
import {default as sockets} from './sockets';

const app = express();
const server = require("http").createServer(app);

app.use(cors());
sockets(server);

app.get('/', (req: Request, res: Response) => {
  res.send('Index');
});


const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
