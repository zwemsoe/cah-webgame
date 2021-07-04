import { Game } from "../models/game";
import {
    getRoom,
    setRoom
} from "../room-manager";
import { config } from "../constants"


module.exports = (socket: any, io: any) => {
    socket.on("start game", async ({ roomCode }: { roomCode: string }) => {
        console.log("starting game");
        io.in(roomCode).emit("game start update");
    });

    socket.on("game state init", async ({ roomCode }: { roomCode: string }) => {
        console.log("game init");
        const room = await getRoom(roomCode);
        if (room) {
            room.game = Game.getNewGameInstance(room.users);
            room.game.NSFW = room.settings.toggleNSFW
            room.game.init();
            const players = room.game.getAllPlayers();
            const blackCard = room.game.current_black_card;
            await setRoom(roomCode, config.ROOM_EXPIRY, room)
            io.in(roomCode).emit("game init update", { players, blackCard });
        }

    });

    socket.on("card select by player", async ({ cardId, playerId, roomCode }: { cardId: string, playerId: string, roomCode: string }) => {
        console.log("select card by player");
        const room = await getRoom(roomCode);
        if (room) {
            room.game.playCard(cardId, playerId);
            const players = room.game.getAllPlayers();
            const playedCards = room.game.played_cards;
            await setRoom(roomCode, config.ROOM_EXPIRY, room)
            if (playedCards.length >= players.length - 1) {
                const shuffled = room.game.shufflePlayedCards();
                io.in(roomCode).emit("game state update player", { players, shuffled });
            } else {
                io.in(roomCode).emit("players update", { players });
            }
        }

    });

    socket.on("card select by judge", async ({ cardId, playerId, roomCode }: { cardId: string, playerId: string, roomCode: string }) => {
        console.log("select card by judge");
        const room = await getRoom(roomCode);
        if (room) {
            const winnerCard = room.game.pickWinnerCard(cardId);
            const players = room.game.getAllPlayers();
            room.game.setPlayersSubmitClicksToFalse();
            await setRoom(roomCode, config.ROOM_EXPIRY, room)
            io.in(roomCode).emit("game state update judge", { players, winnerCard });
        }

    });

    socket.on("next turn", async ({ roomCode, playerId }: { roomCode: string, playerId: string }) => {
        console.log("next turn");
        const room = await getRoom(roomCode);
        if (room) {
            room.game.addNextClick(playerId);
            const players = room.game.getAllPlayers();
            if (room.game.next_clicks.length >= room.game.players.length) {
                console.log("next turn complete");
                room.game.refillCards();
                room.game.updateRound();
                room.game.updateJudge();
                room.game.drawBlackCard();
                room.game.next_clicks = [];
                room.game.played_cards = [];
                room.game.setPlayersNextClicksToFalse();
                const players = room.game.getAllPlayers();
                const blackCard = room.game.current_black_card;
                const round = room.game.round;
                await setRoom(roomCode, config.ROOM_EXPIRY, room)
                io.in(roomCode).emit("next turn client", { players, blackCard, round });
            } else {
                await setRoom(roomCode, config.ROOM_EXPIRY, room)
                io.in(roomCode).emit("players update", { players });
            }
        }
    });



}