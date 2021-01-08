const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(cors());

io.on("connection", (socket) => {
  console.log("a user connected");
});

http.listen(4000, () => {
  console.log("listening on 4000");
});
