import { client } from "../redisClient";

const getOnlineUser = async (id: string, cb: any) => {
  client.get(`online:${id}`, (err: any, socketId: any) => {
    if (socketId) {
      cb(socketId);
    } else cb(null);
  });
};

const setOnlineUser = (userId: string, expiresIn: number, socketId: string) => {
  client.setex(`online:${userId}`, expiresIn, socketId);
};

const deleteOnlineUser = (userId: string) => {
  client.del(`online:${userId}`);
};

module.exports = {
  getOnlineUser,
  setOnlineUser,
  deleteOnlineUser,
};


