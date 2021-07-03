import { User, Room, Setting } from "./interfaces";
import { getRoom, deleteRoom, setRoom } from "./utils";
import { config } from "./constants";

const addUser = async (
  roomId: string,
  clientName: string,
  clientId: string,
  socketId: string
) => {
  const room = await getRoom(roomId);
  if (room) {
    const users = room.users;
    const user: User = {
      id: clientId,
      name: clientName,
      roomId: roomId,
      socketId: socketId,
    };
    users.push(user);
  }
  await setRoom(roomId, config.ROOM_EXPIRY, room);
};

const createRoom = async (roomId: string) => {
  const room: Room = {
    users: [],
    settings: {
      rounds: 3,
      toggleNSFW: false,
    },
    game: null,
    startTime: new Date(),
  };
  await setRoom(roomId, config.ROOM_EXPIRY, room);
};

const getAllUsers = async (roomId: string) => {
  const room = await getRoom(roomId);
  if (room) {
    return room.users;
  }
};

const changeRoomSettings = async (settings: Setting, roomCode: string) => {
  const room = await getRoom(roomCode);
  if (room) {
    room.settings = settings;
    await setRoom(roomCode, config.ROOM_EXPIRY, room);
  }
};

const getRoomSettings = async (roomCode: string) => {
  const room = await getRoom(roomCode);
  if (room) {
    return room.settings;
  }
};

const leaveRoom = async (roomCode: string, socketId: string) => {
  const room = await getRoom(roomCode);
  if (room) {
    const index = room.users.findIndex(
      (user: User) => user.socketId === socketId
    );
    if (index > -1) {
      room.users.splice(index, 1);
      await setRoom(roomCode, config.ROOM_EXPIRY, room);
    }
  }
};

const updateUserSocketId = async (
  roomCode: string,
  userId: string,
  socketId: string
) => {
  const room = await getRoom(roomCode);
  if (room) {
    room.users.forEach((user: User) => {
      if (user.id === userId) {
        user.socketId = socketId;
      }
    });
    await setRoom(roomCode, config.ROOM_EXPIRY, room);
  }
};

const getUserSocketId = async (
  roomCode: string,
  userId: string,
) => {
  const room = await getRoom(roomCode);
  if (room) {
    const user = room.users.find((user: User) => user.id === userId);
    return user.socketId;
  }
};

export {
  addUser,
  createRoom,
  getRoom,
  setRoom,
  getAllUsers,
  changeRoomSettings,
  getRoomSettings,
  deleteRoom,
  leaveRoom,
  updateUserSocketId,
  getUserSocketId
};
