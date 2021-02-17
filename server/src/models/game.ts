import { randomString } from '../utils';
import {User, WhiteCard, BlackCard} from '../interfaces';
import { Player } from "./player";
import axios from 'axios';

class Game {
    players: Player[] = [];
    white_cards: WhiteCard[] = [];
    black_cards: BlackCard[] = [];
    played_cards: WhiteCard[] = [];
    current_black_card: BlackCard | null = null; 
    judge_index = 0;
    round = 0;

    constructor(users: User[]){ 
        this.assignPlayers(users);
    }

    init = async () => {
        await this.populateCards();
        this.distributeCards();
        this.drawBlackCard();
    }

    //Getters
    getPlayerById = (id:string) => {
        const index = this.players.findIndex((p) => p.id === id);
        if(index !== -1) return this.players[index];
        return null;
    }

    getWinner = () => {
        const max_points = this.players.reduce((max, p) => p.points > max ? p.points : max, this.players[0].points);
        return this.players.filter((p) => p.points === max_points);
    }

    getAllPlayers = () => {
        return this.players;
    }

    private assignPlayers = (users: User[]) => {
        const random_judge = Math.floor(Math.random() * users.length);
        this.judge_index = random_judge;
        users.map((user: User, i) => {
            const player = new Player(user);
            if (i===random_judge) player.isJudge = true;
            this.players.push(player);
        })
    }

    private populateCards = async () => {
        const res = await axios.get("https://cah.greencoaststudios.com/api/v1/official/main_deck");
        this.black_cards = res.data.black;
        res.data.white.map((item : string) => {
            const card = {
                content: item,        
                draw: 1,
            }
            this.white_cards.push(card);
        })
    }

    private distributeCards = () => {
        this.players.map((player:Player) => {
            while(player.cards.length < 10){
                const index = Math.floor(Math.random() * this.white_cards.length);
                const card = this.white_cards[index];
                if(card.draw===1){
                    card.draw--;
                    card.cardOwner = player.id;
                    card.id = randomString(8);
                    player.cards.push(card);
                }
            }
        })
    }

    drawBlackCard = () => {
        while(!this.current_black_card){
            const index = Math.floor(Math.random() * this.black_cards.length);
            const card = this.black_cards[index];
            if(card.draw===1){
                card.draw--;
                this.current_black_card = card;
            }
        }
    }

    playCard = (ids: string[], pick: number, playerIndex: number) => {
        const player = this.players[playerIndex];
        if(pick === 1){
            const cards = player.cards.filter((item, i, arr) => {
                return item.id === ids[0];
            });
            this.played_cards = this.played_cards.concat(cards);
            player.removeCard(ids[0]);
        } else {
            const cards = player.cards.filter((item, i, arr) => {
                return item.id === ids[0] || item.id === ids[1];
            });
            this.played_cards = this.played_cards.concat(cards);
            player.removeCard(ids[0]);
            player.removeCard(ids[1]);
        }
    }

    updateRound = () => {
        this.round++;
    }

    refillCards = () => {
        this.distributeCards();
    }

    updateJudge = () => {
        this.players[this.judge_index].isJudge = false;
        this.judge_index++;
        if(this.judge_index >= this.players.length) this.judge_index = 0;
        this.players[this.judge_index].isJudge = true;
    }

    pickWinnerCard = (ids: string[], pick: number) => {
        if(pick === 1){
            const cards = this.played_cards.filter((item, i, arr) => {
                return item.id === ids[0];
            });
            const player = cards[0].cardOwner && this.getPlayerById(cards[0].cardOwner);
            player && player.addPoints(100);
        } else {
            const cards = this.played_cards.filter((item, i, arr) => {
                return item.id === ids[0] || item.id === ids[1];
            });
            const player = cards[0].cardOwner && this.getPlayerById(cards[0].cardOwner);
            player && player.addPoints(200);
        }
    }
}

export {Game};