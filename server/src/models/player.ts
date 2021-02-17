import {User, WhiteCard, BlackCard} from '../interfaces';

class Player {
    name = "";
    id = "";
    isJudge = false;
    cards: WhiteCard[] = [];
    judge_cards: BlackCard[] = [];
    points = 0;

    constructor(user: User){
        this.name = user.name;
        this.id = user.id;
    }

    removeCard = (id:string) => {
        const new_cards = this.cards.filter((item, i, arr) => {
            return item.id !== id;
        });
        this.cards = new_cards;
    }

    addPoints = (points: number) => {
        this.points += points;
    }

}

export {Player};