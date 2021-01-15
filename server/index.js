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
});

http.listen(4000, () => {
  console.log("listening on 4000");
});
