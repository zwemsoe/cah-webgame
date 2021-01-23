let rooms = [];

const addUser = (roomId, clientName, clientId) => {
  const selected_room = rooms.find((room) => room.id === roomId);
  const users = selected_room.users;
  const user = {
    id: clientId,
    name: clientName,
    roomId: roomId,
  };
  users.push(user);
};

const createRoom = (roomId) => {
  const room = {
    id: roomId,
    users: [],
  };
  rooms.push(room);
};

const roomExists = (roomId) => {
  return rooms.find((room) => room.id === roomId);
};

const getAllUsers = (roomId) => {
  const selected_room = rooms.find((room) => room.id === roomId);
  const room_users = selected_room.users;
  return room_users;
};

module.exports = {
  addUser,
  createRoom,
  roomExists,
  getAllUsers,
};
