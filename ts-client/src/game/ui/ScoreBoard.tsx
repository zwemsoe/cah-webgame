import { User, Player } from "../../interfaces";

interface Props{
    players: Player[]
}

export default function ScoreBoard(props: Props) {
    return (
    <div>
        <p>Score Board: </p>
        <ul>
            {props.players.map((player: Player, i: any) => {
                return (
                <li key={i}>
                    {player.name} : {player.points} {player.isJudge && "(Judge)"}
                </li>
                )
            })}
        </ul>
    </div>
    )
}