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
    socket.on("start game", async ({ roomCode }: { roomCode: string }) => {
        console.log("starting game");
        io.in(roomCode).emit("game start update");
    });

    socket.on("game state init", async ({ roomCode }: { roomCode: string }) => {
        console.log("starting game");
        const room = roomExists(roomCode);
        room.game = new Game(room.users);
        await room.game.init();
        const players = room.game.getAllPlayers();
        const blackCard = room.game.current_black_card;
        io.in(roomCode).emit("game init update", { players, blackCard });
    });

    socket.on("card select by player", async ({ cardId, playerId, roomCode }: { cardId: string, playerId: string, roomCode: string }) => {
        console.log("starting game");
        const room = roomExists(roomCode);
        room.game.playCard(cardId, playerId);
        const players = room.game.getAllPlayers();
        const playedCards = room.game.played_cards;
        const blackCard = room.game.current_black_card;
        console.log("Played Cards: ", playedCards);
        io.in(roomCode).emit("game state update", { players, playedCards, blackCard });
    });

    socket.on("card select by judge", async ({ cardId, playerId, roomCode }: { cardId: string, playerId: string, roomCode: string }) => {
        console.log("starting game");
        const room = roomExists(roomCode);
        const winnerCard = room.game.pickWinnerCard(cardId);
        room.game.refillCards();
        room.game.updateJudge();
        const players = room.game.getAllPlayers();
        const playedCards = room.game.played_cards;
        room.game.drawBlackCard();
        const blackCard = room.game.current_black_card;
        console.log("Played Cards: ", playedCards);
        io.in(roomCode).emit("game state update", { players, playedCards, winnerCard, blackCard });
    });
}