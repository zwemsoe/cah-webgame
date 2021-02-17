import ScoreBoard from "./ScoreBoard";
import { User, Player } from "../../interfaces";

interface Props {
    players: Player[],
}

export default function GameRoom(props: Props){
    return (
        <>
            <p>Game Room</p>
            <ScoreBoard players={props.players}/>
        </>
    )
}