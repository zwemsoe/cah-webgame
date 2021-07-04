import {
    getAllUsers,
    getUserSocketId
} from "../room-manager";

module.exports = (socket: any, io: any) => {
    socket.on("join video chat", async (roomCode: string) => {
        const clients = await getAllUsers(roomCode);
        socket.emit("update peers", clients);
    })

    socket.on("sending signal", async ({ signal, callerId, userToSignal, roomCode }: { signal: any, callerId: string, userToSignal: string, roomCode: string }) => {
        const socketId = await getUserSocketId(roomCode, userToSignal);
        io.to(socketId).emit('peer joined', { signal: signal, callerId: callerId });
    });

    socket.on("returning signal", async ({ signal, callerId, roomCode, clientId }: { signal: any, callerId: string, roomCode: string, clientId: string }) => {
        const socketId = await getUserSocketId(roomCode, callerId);
        io.to(socketId).emit('receiving returned signal', { signal, id: clientId });
    });
}