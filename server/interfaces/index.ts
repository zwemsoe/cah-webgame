export interface User {
    id: string,
    name: string,
    roomId: string,
    socketId?: string,
}

export interface Room {
    users: User[],
    settings: Setting,
    game: any,
    startTime: Date,
}

export interface Setting {
    rounds: number,
    toggleNSFW: boolean,
}

export interface WhiteCard {
    content: string,
    draw: number,
    cardOwner?: string,
    id?: string, //to track on cards list
}

export interface BlackCard {
    content: string,
    draw: number,
}