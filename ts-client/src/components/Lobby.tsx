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
            </select>
            <br />

            <label htmlFor="judge-select" className="mr-5">
              Judge Time:
            </label>
            <select
              className="w-auto border bg-white rounded px-3 py-2 outline-none"
              name="judgeTime"
              value={props.setting.judgeTime}
              onChange={props.handleSetting}
            >
              <option value="60">60s</option>
              <option value="90">90s</option>
              <option value="120">120s</option>
            </select>
            <br />

            <label htmlFor="pick-select" className="mr-5">
              Pick Time:
            </label>
            <select
              className="w-auto border bg-white rounded px-3 py-2 outline-none mb-2"
              name="pickTime"
              value={props.setting.pickTime}
              onChange={props.handleSetting}
            >
              <option value="60">60s</option>
              <option value="90">90s</option>
              <option value="120">120s</option>
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

            <label htmlFor="judge-select" className="mr-5">
              Judge Time:
            </label>
            <p>{props.setting.judgeTime}s</p>
            <br />

            <label htmlFor="pick-select" className="mr-5">
              Pick Time:
            </label>
            <p>{props.setting.pickTime}s</p>
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
      <p>
        Share with your friends:{" "}
        <span className="rounded-sm px-3 py-3 mt-3 bg-gray-100">
          {window.location.origin + props.match.url}
        </span>
      </p>
    </>
  );
}
