import ScoreBoard from "./ScoreBoard";
import { User, Player, WhiteCard } from "../../interfaces";
import Card from "./Card";

interface Props {
    players: Player[],
    currentPlayer: Player | undefined,
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
                                <Card type="white" content = {card.content}/>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
    return (
        <>
            <p>Game Room</p>
            <ScoreBoard players={props.players}/>
            {props.currentPlayer && renderWhiteCards()}
        </>
    )
}