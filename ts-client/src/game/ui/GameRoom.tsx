import ScoreBoard from "./ScoreBoard";
import { User, Player, WhiteCard, BlackCard } from "../../interfaces";
import Card from "./Card";

interface Props {
    players: Player[],
    currentPlayer: Player | undefined,
    currentBlackCard: BlackCard | null,
}


export default function GameRoom(props: Props){
    
    const renderWhiteCards = () => {
        return (
            <div>
                {
                    props.currentPlayer && 
                    props.currentPlayer.cards.map((card: WhiteCard, i: any) => {
                        return (
                            <div key={i}>
                                <Card 
                                type="white" 
                                card = {card} 
                                />
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const renderCurrentBlackCard = () => {
        return (
            <div>
                {props.currentBlackCard && 
                <Card 
                    type="black" 
                    card = {props.currentBlackCard} 
                />}
                
            </div>
        )
    }

    return (
        <>
            <p>Game Room</p>
            <ScoreBoard players={props.players}/>
            {renderCurrentBlackCard()}
            {props.currentPlayer && renderWhiteCards()}
        </>
    )
}