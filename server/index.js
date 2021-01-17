const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Index");
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("join room", (data) => {
    const { roomCode, clientName, clientId } = data;
    console.log(roomCode + " " + clientName + " " + clientId);
    socket.join(roomCode);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 4001;

http.listen(port, () => {
  console.log(`listening on ${port}`);
});
