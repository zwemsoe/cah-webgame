import {
  addUser,
  createRoom,
  getRoom,
  getAllUsers,
  changeRoomSettings,
  getRoomSettings,
  deleteRoom,
  leaveRoom,
  updateUserSocketId,
} from "../room-manager";
import { Setting, User } from "../interfaces";

module.exports = (socket: any, io: any) => {

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
      socket.join(roomCode);
      const room = await getRoom(roomCode);
      if (!room) {
        await createRoom(roomCode);
        await addUser(roomCode, clientName, clientId, socket.id);
      } else {
        const userExists = room.users.findIndex((user: User) => user.id === clientId);
        if (userExists === -1) {
          await addUser(roomCode, clientName, clientId, socket.id);
        } else {
          await updateUserSocketId(roomCode, clientId, socket.id)
        }
      }
      socket.clientId = clientId;
    }
  );

  //getting room users
  socket.on("get room users", async ({ roomCode }: { roomCode: string }) => {
    const clients = await getAllUsers(roomCode);
    const settings = await getRoomSettings(roomCode);
    io.in(roomCode).emit("room status", { clients });
    io.in(roomCode).emit("setting update", { settings });
  });

  //changing settings
  socket.on(
    "change setting",
    async ({ settings, roomCode }: { settings: Setting; roomCode: string }) => {
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
    const room = await getRoom(roomCode);
    if (room) {
      await deleteRoom(roomCode);
    }
  });

  socket.on("leave room", async ({ roomCode }: { roomCode: string }) => {
    await leaveRoom(roomCode, socket.id);
    const clients = await getAllUsers(roomCode);
    socket.leave(roomCode);
    socket.broadcast.emit("user left video", socket.clientId);
    io.in(roomCode).emit("room status", { clients });
  })

  //user leaves
  socket.on("disconnect", (reason: any) => {
    console.log("disconnecting: ", socket.clientId)
    if (socket.clientId) {
      socket.broadcast.emit("user left video", socket.clientId);
      delete socket.clientId;
    }

  });
};
