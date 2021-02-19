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
            <div className="flex">
              <label
                htmlFor="toogleA"
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    id="toogleA"
                    type="checkbox"
                    className="hidden"
                    name="toggleNSFW"
                    onChange={props.handleSetting}
                  />
                  <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                  <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">NSFW</div>
              </label>
            </div>
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
            <div className="flex">
              <label
                htmlFor="toogleA"
                className="flex items-center cursor-pointer"
              >
                <div className="relative">
                  <input
                    id="toogleA"
                    type="checkbox"
                    className="hidden"
                    name="toggleNSFW"
                    checked={props.setting?.toggleNSFW}
                    disabled
                  />
                  <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                  <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">NSFW</div>
              </label>
            </div>
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
