import { settings } from "cluster";
import React, { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../contexts/SocketContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { User, Setting } from "../interfaces";

interface Props {
  history: any;
  match: any;
}

var defaultSetting: Setting = {
  rounds: 3,
  judgeTime: 60,
  pickTime: 60,
}

export default function Room({ match, history }: Props) {
  const roomCode = match.params.roomId;
  const [players, setPlayers] = useLocalStorage(`room-players-${roomCode}`, []);
  const [hostPlayer, setHostPlayer] = useLocalStorage(
    `host-player-${roomCode}`,
    undefined
  );
  const [currentPlayer, setCurrentPlayer] = useLocalStorage(
    `current-player-${history.location.state.clientId}`,
    undefined
  );
  const [lastJoined, setLastJoined] = useState<number | null>(null);
  const [setting, changeSetting] = useState<Setting>(defaultSetting);
  const settingRef = useRef(defaultSetting);
  settingRef.current = setting;

  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.emit("get room users", {
      roomCode: roomCode,
    });
    socket.emit("get room setting", { roomCode: roomCode });
  }, []);

  useEffect(() => {
    socket.on("room status", ({ clients }: { clients: User[] }) => {
      console.log(`Clients: `, clients);
      setPlayers(clients);
      if (clients.length !== 0) {
        setLastJoined(clients.length - 1);
        setHostPlayer(clients[0]);
        var id: string | undefined = history.location.state.clientId;
        setCurrentPlayer(clients.find((client) => client.id === id));
      }
    });
  }, [players]);

  useEffect(() => {
    socket.on("setting update", ({ settings }: { settings: Setting }) => {
      if (hostPlayer && currentPlayer) {
        if (hostPlayer.id !== currentPlayer.id) {
          changeSetting(settings);
        }
      }
    });
  });

  const handleSetting = (e: any) => {
    const { name, value } = e.target;
    const parse_value = parseInt(value);
    changeSetting((prevState) => ({
      ...prevState,
      [name]: parse_value,
    }));
    setTimeout(() => {
      socket.emit("change setting", { settings: settingRef.current, roomCode: roomCode });
    }, 500)
  }


  const renderSettings = () => {
    if (hostPlayer && currentPlayer) {
      if (hostPlayer.id === currentPlayer.id) {
        return (
          <div>
            <label htmlFor="rounds-select" className="mr-5">
              Number of Rounds:
            </label>
            <select
              className="w-auto border bg-white rounded px-3 py-2 outline-none"
              name="rounds"
              value={setting.rounds}
              onChange={handleSetting}
            >
              <option value="3">
                3
              </option>
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
              value={setting.judgeTime}
              onChange={handleSetting}
            >
              <option value="60">
                60s
              </option>
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
              value={setting.pickTime}
              onChange={handleSetting}
            >
              <option value="60">
                60s
              </option>
              <option value="90">90s</option>
              <option value="120">120s</option>
            </select>
            <br />
            <button className="bg-yellow-500 hover:bg-yellow-300 text-black font-bold h-10 w-28 rounded">
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
            <p>{setting.rounds}</p>
            <br />

            <label htmlFor="judge-select" className="mr-5">
              Judge Time:
            </label>
            <p>{setting.judgeTime}s</p>
            <br />

            <label htmlFor="pick-select" className="mr-5">
              Pick Time:
            </label>
            <p>{setting.pickTime}s</p>
            <br />
          </div>
        );
      }
    }
  };

  return (
    <>
      <p className="font-extrabold">
        {lastJoined !== null && players[lastJoined].name + " joined."}
      </p>
      <p className="font-bold">Players List:</p>
      <ul className="mb-5">
        {players.map((player: any, i: number) => {
          return (
            <li key={i}>
              - {player.name}{" "}
              {(hostPlayer && hostPlayer.id) === player.id && "(Host)"}
            </li>
          );
        })}
      </ul>

      <p className="font-bold">Settings</p>
      {renderSettings()}
    </>
  );
}
