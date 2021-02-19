
export default (server: any) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "https://cah-webgame.web.app",
            credentials: true,
        },
    });

    io.on("connection", (socket: any) => {
        require('./handlers/user-handler')(socket, io);
        require('./handlers/game-handler')(socket, io);
    });

    return io;
}
