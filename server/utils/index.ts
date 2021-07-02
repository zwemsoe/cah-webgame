import { Room, User } from "../interfaces";
import { Game } from "../models/game";
import { client } from "../redisClient";

// export const getOnlineUser = async (id: string, cb: any) => {
//   client.get(`online:${id}`, (err: any, socketId: any) => {
//     if (socketId) {
//       cb(socketId);
//     } else cb(null);
//   });
// };

// export const setOnlineUser = (userId: string, expiresIn: number, socketId: string) => {
//   client.setex(`online:${userId}`, expiresIn, socketId);
// };

// export const deleteOnlineUser = (userId: string) => {
//   client.del(`online:${userId}`);
// };

function fix(obj: any) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      obj[property] = eval("(" + obj[property] + ")");
    }
  }
  return obj;
}

export const getRoom = async (id: string) => {
  const room = await client.get(`room:${id}`);
  const parsed = JSON.parse(room);
  if (parsed?.game) {
    parsed.game = Game.getGameInstance(parsed.game)
  }
  return parsed;
}

export const setRoom = (roomId: string, expiresIn: number, room: Room) => {
  return client.setex(`room:${roomId}`, expiresIn, JSON.stringify(room));
}

export const deleteRoom = (id: string) => {
  return client.del(`room:${id}`);
}

export const getUser = async (id: string) => {
  const user = await client.get(`user:${id}`);
  return JSON.parse(user);
}

export const setUser = (userId: string, expiresIn: number, user: User) => {
  return client.setex(`user:${userId}`, expiresIn, JSON.stringify(user));
}

export const deleteUser = (id: string) => {
  return client.del(`user:${id}`);
}


