const {
  addUser,
  createRoom,
  roomExists,
  getAllUsers,
  changeRoomSettings,
  getRoomSettings,
  deleteRoom,
  getUserNameById,
} = require("../room-manager");
import { Setting } from "../interfaces";

module.exports = (socket: any, io: any) => {
  console.log("a user connected");

  //joining a room
  socket.on(
    "join room",
    ({
      roomCode,
      clientName,
      clientId,
    }: {
      roomCode: string;
      clientName: string;
      clientId: string;
    }) => {
      console.log(
        "Room Code: " + roomCode + ", Name: " + clientName + ", Id: " + clientId
      );
      socket.join(roomCode);
      if (!roomExists(roomCode)) {
        createRoom(roomCode);
      }
      addUser(roomCode, clientName, clientId, socket.id);
    }
  );

  //getting room users
  socket.on("get room users", ({ roomCode }: { roomCode: string }) => {
    const clients = getAllUsers(roomCode);
    const settings = getRoomSettings(roomCode);
    console.log("Clients", clients);
    io.in(roomCode).emit("room status", { clients });
    io.in(roomCode).emit("setting update", { settings });
  });

  //changing settings
  socket.on(
    "change setting",
    ({ settings, roomCode }: { settings: Setting; roomCode: string }) => {
      console.log("change settings to ", settings);
      changeRoomSettings(settings, roomCode);
      io.in(roomCode).emit("setting update", { settings });
    }
  );

  socket.on("get room setting", ({ roomCode }: { roomCode: string }) => {
    const settings: Setting = getRoomSettings(roomCode);
    io.in(roomCode).emit("setting update", { settings });
  });

  socket.on("delete room", async ({ roomCode }: { roomCode: string }) => {
    console.log("deleting room");
    deleteRoom(roomCode);
  });

  //user leaves
  socket.on("disconnect", (reason: any) => {
    const name = getUserNameById(socket.id);
    console.log(name + " disconnected because of " + reason);
  });
};
