import {
  addUser,
  createRoom,
  getRoom,
  getAllUsers,
  changeRoomSettings,
  getRoomSettings,
  deleteRoom,
} from "../room-manager";
import { Setting } from "../interfaces";

module.exports = (socket: any, io: any) => {
  console.log("a user connected");

  //joining a room
  socket.on(
    "join room",
    async ({
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
      const room = await getRoom(roomCode);
      console.log("room: ", room);
      if (!room) {
        await createRoom(roomCode);
      }
      await addUser(roomCode, clientName, clientId, socket.id);
    }
  );

  //getting room users
  socket.on("get room users", async ({ roomCode }: { roomCode: string }) => {
    const clients = await getAllUsers(roomCode);
    const settings = await getRoomSettings(roomCode);
    console.log("Clients: ", clients);
    io.in(roomCode).emit("room status", { clients });
    io.in(roomCode).emit("setting update", { settings });
  });

  //changing settings
  socket.on(
    "change setting",
    async ({ settings, roomCode }: { settings: Setting; roomCode: string }) => {
      console.log("change settings to ", settings);
      await changeRoomSettings(settings, roomCode);
      io.in(roomCode).emit("setting update", { settings });
    }
  );

  socket.on("get room setting", async ({ roomCode }: { roomCode: string }) => {
    const settings = await getRoomSettings(roomCode);
    io.in(roomCode).emit("setting update", { settings });
  });

  socket.on("delete room", async ({ roomCode }: { roomCode: string }) => {
    console.log("deleting room");
    await deleteRoom(roomCode);
  });

  //user leaves
  socket.on("disconnect", (reason: any) => {
    console.log("disconnecting!")
  });
};
