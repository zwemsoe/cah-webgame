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
  getUserSocketId
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
      console.log(
        "Room Code: " + roomCode + ", Name: " + clientName + ", Id: " + clientId
      );
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
      const clients = await getAllUsers(roomCode);
      socket.broadcast.to(roomCode).emit("update peers", clients);
    }
  );

  socket.on("sending signal", async ({ signal, callerId, userToSignal, roomCode }: { signal: any, callerId: string, userToSignal: string, roomCode: string }) => {
    const socketId = await getUserSocketId(roomCode, userToSignal);
    io.to(socketId).emit('peer joined', { signal: signal, callerId: callerId });
  });

  socket.on("returning signal", async ({ signal, callerId, roomCode, clientId }: { signal: any, callerId: string, roomCode: string, clientId: string }) => {
    const socketId = await getUserSocketId(roomCode, callerId);
    io.to(socketId).emit('receiving returned signal', { signal, id: clientId });
  });

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

  socket.on("leave room", async ({ roomCode, cb }: { roomCode: string, cb: () => void }) => {
    await leaveRoom(roomCode, socket.id);
    const clients = await getAllUsers(roomCode);
    socket.leave(roomCode);
    io.in(roomCode).emit("room status", { clients });
  })

  //user leaves
  socket.on("disconnect", (reason: any) => {
    console.log("disconnecting!")
    if (socket.clientId) {
      delete socket.clientId;
    }
  });
};
