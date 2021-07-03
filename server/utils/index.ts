import { Room, User } from "../interfaces";
import { Game } from "../models/game";
import { client } from "../redisClient";

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
  const socketId = await client.get(`user:${id}`);
  return JSON.parse(socketId);
}

export const setUser = (userId: string, expiresIn: number, socketId: string) => {
  return client.setex(`user:${userId}`, expiresIn, JSON.stringify(socketId));
}

export const deleteUser = (id: string) => {
  return client.del(`user:${id}`);
}


