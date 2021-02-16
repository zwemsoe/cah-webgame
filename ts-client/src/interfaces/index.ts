export interface User {
    id: string,
    name: string,
    roomId: string,
}

export interface Room {
    id: string,
    users: User[],
}

export interface Setting {
    rounds: number,
    judgeTime: number,
    pickTime: number,
}

export interface WhiteCard{
    content: string,
    draw: number,
    cardOwner?: string,
    id?: string, //to track on cards list
}

export interface BlackCard{
    content: string,
    draw: number,
    pick: number,
}