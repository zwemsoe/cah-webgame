export {};

interface User {
    id: string,
    name: string,
    roomId: string,
}

interface Room {
    id: string,
    users: User[],
}


let rooms:Room[] = [];

const addUser = (roomId:string, clientName:string, clientId:string) => {
  const selected_room = rooms.find((room) => room.id === roomId);
  if(selected_room){
    const users = selected_room.users;
    const user:User = {
      id: clientId,
      name: clientName,
      roomId: roomId,
    };
    users.push(user);
  }
  
};

function createRoom(roomId:string):void {
  const room:Room = {
    id: roomId,
    users: [],
  };
  rooms.push(room);
};

const roomExists = (roomId:string) => {
  return rooms.find((room) => room.id === roomId);
};

const getAllUsers = (roomId:string) => {
  const selected_room = rooms.find((room) => room.id === roomId);
  if(selected_room){
    const room_users = selected_room.users;
    return room_users;
  }
};

module.exports = {
  addUser,
  createRoom,
  roomExists,
  getAllUsers,
};
