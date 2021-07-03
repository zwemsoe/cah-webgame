import { Player } from "../../interfaces";
import { useState, useEffect } from "react";

interface Props {
  players: Player[];
  gameOver?: boolean;
}

export default function ScoreBoard(props: Props) {
  const [gameWinner, setGameWinner] = useState<Player[]>();

  useEffect(() => {
      if(props.gameOver){
        const max_points = props.players.reduce(
            (max, p) => (p.points > max ? p.points : max),
            props.players[0].points
          );
          const player = props.players.filter((p) => p.points === max_points);
          setGameWinner(player);
      }
  }, [props.gameOver, props.players])

  const renderPlayerState = (player: Player) => {
    if (player?.isJudge) {
      return `${player.name} : ${player.points} (Judge)`;
    } else {
      return `${player.name} : ${player.points} ${
        player.submitClicked || player.nextClicked ? "ready" : "waiting..."
      }`;
    }
  };
  return (
    <div>
      <p>Score Board: </p>
      <ul>
        {props.players.map((player: Player, i: any) => {
          return <li key={i}>{renderPlayerState(player)}</li>;
        })}
      </ul>
      {props.gameOver && (
        <div>
          <p>Winner(s): </p>
          <ul>
            {gameWinner?.map((player: Player, i: any) => {
              return (
                <li key={i}>
                  {player.name} : {player.points}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
