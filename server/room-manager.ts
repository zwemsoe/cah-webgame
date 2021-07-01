import { User, Room, Setting } from "./interfaces";

export let rooms: Room[] = [];

const printRooms = () => {
  console.log(rooms);
}

const addUser = (roomId: string, clientName: string, clientId: string, socketId: string) => {
  const selected_room = rooms.find((room) => room.id === roomId);
  if (selected_room) {
    const users = selected_room.users;
    const user: User = {
      id: clientId,
      name: clientName,
      roomId: roomId,
      socketId: socketId,
    };
    users.push(user);
  }
};

const createRoom = (roomId: string) => {
  const room: Room = {
    id: roomId,
    users: [],
    settings: {
      rounds: 3,
      toggleNSFW: false,
    },
    game: null,
    startTime: new Date(),
  };
  rooms.push(room);
};

const roomExists = (roomId: string) => {
  return rooms.find((room) => room.id === roomId);
};

const getAllUsers = (roomId: string) => {
  const selected_room = rooms.find((room) => room.id === roomId);
  if (selected_room) {
    const room_users = selected_room.users;
    return room_users;
  }
};

const changeRoomSettings = (settings: Setting, roomCode: string) => {
  const room = roomExists(roomCode);
  if (room) {
    room.settings = settings;
  }
};

const getRoomSettings = (roomCode: string) => {
  const room = roomExists(roomCode);
  if (room) {
    return room.settings;
  }
};

const deleteRoom = (roomCode: string) => {
  const room = roomExists(roomCode);
  if (room) {
    const filtered = rooms.filter((item, index, arr) => {
      return item.id !== room.id;
    });
    rooms = filtered;
  }
}

const getUserNameById = (socketId: string) => {
  for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    for (let j = 0; j < room.users.length; j++) {
      const user = room.users[j];
      if (user.socketId === socketId) {
        return user.name;
      }
    }
  }
}

export {
  printRooms,
  addUser,
  createRoom,
  roomExists,
  getAllUsers,
  changeRoomSettings,
  getRoomSettings,
  deleteRoom,
  getUserNameById,
};
