import express from 'express';
import cors from 'cors';
import { default as sockets } from './sockets';

const app = express();
const server = require("http").createServer(app);

app.use(cors());
sockets(server);

if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static('ts-client/build'));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'ts-client', 'build', 'index.html'));
  });
}


const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
