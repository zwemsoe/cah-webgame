import { client } from "../redisClient";

export const getOnlineUser = async (id: string, cb: any) => {
  client.get(`online:${id}`, (err: any, socketId: any) => {
    if (socketId) {
      cb(socketId);
    } else cb(null);
  });
};

export const setOnlineUser = (userId: string, expiresIn: number, socketId: string) => {
  client.setex(`online:${userId}`, expiresIn, socketId);
};

export const deleteOnlineUser = (userId: string) => {
  client.del(`online:${userId}`);
};


