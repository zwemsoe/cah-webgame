import { randomString } from "../utils";
import { User, WhiteCard, BlackCard } from "../interfaces";
import { Player } from "./player";
import axios from "axios";

class Game {
    players: Player[] = [];
    white_cards: WhiteCard[] = [];
    black_cards: BlackCard[] = [];
    played_cards: WhiteCard[] = [];
    current_black_card: BlackCard | null = null;
    judge_index = 0;
    round_index = 0;
    round = 1;
    next_clicks: string[] = [];

    constructor(users: User[]) {
        this.assignPlayers(users);
    }

    init = async () => {
        await this.populateCards();
        this.distributeCards();
        this.drawBlackCard();
    };

    //Getters
    getPlayerById = (id: string) => {
        const index = this.players.findIndex((p) => p.id === id);
        if (index !== -1) return this.players[index];
        return null;
    };

    getWinner = () => {
        const max_points = this.players.reduce(
            (max, p) => (p.points > max ? p.points : max),
            this.players[0].points
        );
        return this.players.filter((p) => p.points === max_points);
    };

    getAllPlayers = () => {
        return this.players;
    };

    private assignPlayers = (users: User[]) => {
        const random_judge = Math.floor(Math.random() * users.length);
        this.judge_index = random_judge;
        this.round_index =
            random_judge === 0 ? users.length - 1 : random_judge - 1;
        users.map((user: User, i) => {
            const player = new Player(user);
            if (i === random_judge) player.isJudge = true;
            this.players.push(player);
        });
    };

    private populateCards = async () => {
        const res = await axios.get(
            "https://cah.greencoaststudios.com/api/v1/official/main_deck"
        );
        this.black_cards = res.data.black;
        res.data.black.map((item: any) => {
            if (item.pick === 1) {
                const card = {
                    content: item.content,
                    draw: item.draw,
                };
                this.black_cards.push(card);
            }
        });
        res.data.white.map((item: string) => {
            const card = {
                content: item,
                draw: 1,
            };
            this.white_cards.push(card);
        });
    };

    private distributeCards = () => {
        this.players.map((player: Player) => {
            while (player.cards.length < 10) {
                const index = Math.floor(Math.random() * this.white_cards.length);
                const card = this.white_cards[index];
                if (card.draw === 1) {
                    card.draw--;
                    card.cardOwner = player.id;
                    card.id = randomString(10);
                    player.cards.push(card);
                }
            }
        });
    };

    drawBlackCard = () => {
        let chosen = null;
        while (!chosen) {
            const index = Math.floor(Math.random() * this.black_cards.length);
            const card = this.black_cards[index];
            if (card.draw === 1) {
                card.draw--;
                chosen = card;
            }
        }
        this.current_black_card = chosen;
    };

    playCard = (id: string, playerId: string) => {
        const player = this.getPlayerById(playerId);
        if (player) {
            const card = player.cards.find((item, i, arr) => {
                return item.id === id;
            });
            console.log(playerId + " card: ", card);
            card && this.played_cards.push(card);
            player.removeCard(id);
        }
    };

    updateRound = () => {
        if (this.judge_index === this.round_index) {
            this.round++;
        }
    };

    refillCards = () => {
        this.distributeCards();
        this.played_cards = [];
    };

    updateJudge = () => {
        this.players[this.judge_index].isJudge = false;
        this.judge_index++;
        if (this.judge_index >= this.players.length) this.judge_index = 0;
        this.players[this.judge_index].isJudge = true;
    };

    pickWinnerCard = (id: string) => {
        const card = this.played_cards.find((item) => {
            return item.id === id;
        });
        const player = card && card.cardOwner && this.getPlayerById(card.cardOwner);
        player && player.addPoints(100);
        return card;
    };

    addNextClick = (playerId: string) => {
        const exists = this.next_clicks.find((item) => item === playerId);
        if (!exists) {
            this.next_clicks.push(playerId);
        }
    };
}

export { Game };
