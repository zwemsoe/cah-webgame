const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);

app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Index");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join room", (data) => {
    const { roomCode, clientName } = data;
    console.log(
      "Room Code: " + roomCode + ", Name: " + clientName + ", Id: " + socket.id
    );
    socket.nickname = clientName;
    socket.join(roomCode);
  });

  socket.on("get room users", (data) => {
    const { roomCode } = data;
    // const clients = io.sockets.clients(roomCode);
    // clients.forEach(function (client) {
    //   console.log("Username: " + client.nickname);
    // });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
