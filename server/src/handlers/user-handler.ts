const { addUser, createRoom, roomExists, getAllUsers, changeRoomSettings, getRoomSettings } = require('../room-manager');
import { User, Room, Setting } from '../interfaces';

module.exports = (socket: any, io: any) => {
    console.log("a user connected");
    
    //joining a room
    socket.on("join room", ({ roomCode, clientName, clientId }: { roomCode: string, clientName: string, clientId: string }) => {
        console.log(
            "Room Code: " + roomCode + ", Name: " + clientName + ", Id: " + clientId
        );
        socket.join(roomCode);
        if (!roomExists(roomCode)) {
            createRoom(roomCode);
        }
        addUser(roomCode, clientName, clientId);
    });

    //getting room users
    socket.on("get room users", ({ roomCode }: { roomCode: string }) => {
        const clients = getAllUsers(roomCode);
        const settings = getRoomSettings(roomCode);
        console.log("Clients", clients);
        io.in(roomCode).emit("room status", { clients });
        io.in(roomCode).emit("setting update", {settings});
    });

    //changing settings
    socket.on("change setting", ({ settings, roomCode} : {settings: Setting, roomCode: string}) => {
        console.log("change settings to ", settings);
        changeRoomSettings(settings, roomCode);
        io.in(roomCode).emit("setting update", {settings});
    });

    socket.on("get room setting", ({ roomCode} : { roomCode: string}) => {
        const settings: Setting = getRoomSettings(roomCode);
        io.in(roomCode).emit("setting update", {settings});
    });

    //user leaves
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
}