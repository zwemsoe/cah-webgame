import { User, Setting } from "../interfaces";

interface Props {
  setting: Setting;
  players: User[];
  hostPlayer: User;
  currentPlayer: User;
  lastJoined: number | null;
  handleSetting: (e: any) => void;
  handleStartGame: () => void;
  match: any;
}

export default function Lobby(props: Props) {
  console.log();
  const renderSettings = () => {
    if (props.hostPlayer && props.currentPlayer) {
      if (props.hostPlayer.id === props.currentPlayer.id) {
        return (
          <div>
            <label htmlFor="rounds-select" className="mr-5">
              Number of Rounds:
            </label>
            <select
              className="w-auto border bg-white rounded px-3 py-2 outline-none"
              name="rounds"
              value={props.setting.rounds}
              onChange={props.handleSetting}
            >
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
            <br />
            <button
              className="bg-yellow-500 hover:bg-yellow-300 text-black font-bold h-10 w-28 rounded"
              onClick={props.handleStartGame}
            >
              Start Game
            </button>
          </div>
        );
      } else {
        return (
          <div>
            <label htmlFor="rounds-select" className="mr-5">
              Number of Rounds:
            </label>
            <p>{props.setting.rounds}</p>
            <br />
          </div>
        );
      }
    }
  };
  return (
    <>
      <p className="font-extrabold">
        {props.lastJoined !== null &&
          props.players[props.lastJoined].name + " joined."}
      </p>
      <p className="font-bold">Players List:</p>
      <ul className="mb-5">
        {props.players.map((player: User, i: number) => {
          return (
            <li key={i}>
              - {player.name}{" "}
              {(props.hostPlayer && props.hostPlayer.id) === player.id &&
                "(Host)"}
            </li>
          );
        })}
      </ul>

      <p className="font-bold">Settings</p>
      {renderSettings()}
      <p className="mt-3">
        Share with your friends:{" "}
        <span className="text-white rounded-sm px-3 py-3 mt-3 bg-black">
          {window.location.origin + props.match.url}
        </span>
      </p>
    </>
  );
}
