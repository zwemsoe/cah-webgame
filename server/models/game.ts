import { User, WhiteCard, BlackCard } from "../interfaces";
import { Player } from "./player";
import { nanoid } from "nanoid";
import base_cards from "../data/base";
import family_cards from "../data/family";


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
    NSFW: boolean = false;

    constructor(users: User[] | null, game: Game | null) {
        if (users) {
            this.assignPlayers(users);
        } else if (game) {
            game.players.map((player) => {
                this.players.push(Player.getPlayerInstance(player));
            })
            this.white_cards = game.white_cards;
            this.black_cards = game.black_cards;
            this.played_cards = game.played_cards;
            this.current_black_card = game.current_black_card;
            this.judge_index = game.judge_index;
            this.round_index = game.round_index;
            this.round = game.round;
            this.next_clicks = game.next_clicks;
            this.NSFW = game.NSFW;
        }

    }

    static getNewGameInstance(users: User[]) {
        return new Game(users, null);
    }

    static getGameInstance(game: Game) {
        return new Game(null, game);
    }

    init = () => {
        this.populateCards();
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
            const player = Player.getNewPlayerInstance(user);
            if (i === random_judge) player.isJudge = true;
            this.players.push(player);
        });
    };

    private populateCards = () => {
        const cards = this.NSFW ? base_cards : family_cards;
        this.white_cards = cards.white;
        this.black_cards = cards.black;
    };

    private distributeCards = () => {
        this.players.map((player: Player) => {
            while (player.cards.length < 10) {
                const index = Math.floor(Math.random() * this.white_cards.length);
                const card = this.white_cards[index];
                if (card.draw === 1) {
                    card.draw--;
                    card.cardOwner = player.id;
                    card.id = nanoid(8);
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
            card && this.played_cards.push(card);
            player.removeCard(id);
            player.submitClicked = true;
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
            const player = this.getPlayerById(playerId);
            if (player) player.nextClicked = true;
            this.next_clicks.push(playerId);
        }
    };

    setPlayersSubmitClicksToFalse = () => {
        for (let i = 0; i < this.players.length; i++) {
            if (!this.players[i].isJudge) {
                this.players[i].submitClicked = false;
            }
        }
    }

    setPlayersNextClicksToFalse = () => {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].nextClicked = false;
        }
    }

    shufflePlayedCards = () => {
        //Deep clone
        let shuffled = JSON.parse(JSON.stringify(this.played_cards));
        // Fisher-Yates Algorithm
        for (let i = this.played_cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = shuffled[i];
            shuffled[i] = shuffled[j];
            shuffled[j] = temp;
        }
        return shuffled;
    }
}

export { Game };
