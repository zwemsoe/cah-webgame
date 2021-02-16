import { Player } from "../models/player";
import { Game } from "../models/game";


module.exports = (socket: any, io: any) => {
    socket.on("start game", ({ roomCode } : { roomCode: string}) => {
        console.log("starting game");
        io.in(roomCode).emit("game start update");
    });
}