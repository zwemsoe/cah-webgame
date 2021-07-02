import { User, WhiteCard, BlackCard } from '../interfaces';

class Player {
    name = "";
    id = "";
    isJudge = false;
    cards: WhiteCard[] = [];
    judge_cards: BlackCard[] = [];
    submitClicked = false;
    nextClicked = false;
    points = 0;

    constructor(user: User | null, player: Player | null) {
        if (user) {
            this.name = user.name;
            this.id = user.id;
        } else if (player) {
            this.name = player.name;
            this.id = player.id;
            this.isJudge = player.isJudge;
            this.cards = player.cards;
            this.judge_cards = player.judge_cards;
            this.submitClicked = player.submitClicked;
            this.nextClicked = player.nextClicked;
            this.points = player.points;
        }
    }

    static getNewPlayerInstance(user: User) {
        return new Player(user, null);
    }

    static getPlayerInstance(player: Player) {
        return new Player(null, player);
    }

    removeCard = (id: string) => {
        const new_cards = this.cards.filter((item, i, arr) => {
            return item.id !== id;
        });
        this.cards = new_cards;
    }

    addPoints = (points: number) => {
        this.points += points;
    }

}

export { Player };