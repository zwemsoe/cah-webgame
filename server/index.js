const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

app.use(cors());

app.listen(4000, () => {
  console.log("listening on 4000");
});
