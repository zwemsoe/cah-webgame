import express from 'express';
import cors from 'cors';
import { default as sockets } from './sockets';
import http from 'http';

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: ['http://localhost:3000', 'https://cah-online-e8c46.web.app'],
  })
);

sockets(server);

app.get('/', (req, res) => {
  res.send("Serving for app deployed at https://cah-online-e8c46.web.app")
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
