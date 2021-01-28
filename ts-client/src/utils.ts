import ioClient from "socket.io-client";

//export const socket = ioClient("http://localhost:5000", {});

export const randomString = (len:number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

