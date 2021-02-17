import { Game } from "../models/game";
const {
    addUser,
    createRoom,
    roomExists,
    getAllUsers,
    changeRoomSettings,
    getRoomSettings,
  } = require("../room-manager");


module.exports = (socket: any, io: any) => {
    socket.on("start game", async ({ roomCode } : { roomCode: string}) => {
        console.log("starting game");
        const room = roomExists(roomCode);
        room.game = new Game(room.users);
        await room.game.init();
        const players = room.game.getAllPlayers();
        io.in(roomCode).emit("game start update", {players});
    });
}