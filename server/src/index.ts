import express, { Response, Request} from 'express';
import cors from 'cors';
const { addUser, createRoom, roomExists, getAllUsers } = require('./users');
const app = express();
const server = require("http").createServer(app);

app.use(cors());

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

app.get('/', (req: Request, res: Response) => {
  res.send('Index');
});

io.on("connection", (socket:any) => {
  console.log("a user connected");


  //joining a room
  socket.on("join room", ({ roomCode, clientName, clientId }: {roomCode: string, clientName: string, clientId: string}) => {
    console.log(
      "Room Code: " + roomCode + ", Name: " + clientName + ", Id: " + clientId
    );
    socket.join(roomCode);
    if (!roomExists(roomCode)) {
      createRoom(roomCode);
    }
    addUser(roomCode, clientName, clientId);
  });

  //getting room users
  socket.on("get room users", ({ roomCode }: {roomCode: string}) => {
    const clients = getAllUsers(roomCode);
    console.log("Clients", clients);
    io.to(roomCode).emit("room status", { clients });
  });

  //user leaves
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`listening on ${port}`);
});
