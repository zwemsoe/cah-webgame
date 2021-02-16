
export default (server: any) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });

    io.on("connection", (socket: any) => {
        require('./handlers/user-handler')(socket, io);
        require('./handlers/game-handler')(socket, io);
    });

    return io;
}
