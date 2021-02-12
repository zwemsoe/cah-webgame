import React, { useState, useEffect, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { User } from "../interfaces";

interface Props {
  history: any;
  match: any;
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
  const socket = useContext(SocketContext);

  useEffect(() => {
    console.log("This runs again after reload");
    console.log("Socket", socket);
    socket.emit("get room users", {
      roomCode: roomCode,
    });
  }, []);

  useEffect(() => {
    console.log("Socket", socket);
    console.log("Players", players);
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

  const renderStartGameBtn = () => {
    if (hostPlayer && currentPlayer) {
      if (hostPlayer.id === currentPlayer.id) {
        return (
          <div>
            <button className="bg-yellow-500 hover:bg-yellow-300 text-black font-bold h-10 w-28 rounded">Start Game</button>
          </div>
        );
      }
    }
  };

  return (
    <>
      <p className="font-extrabold">{lastJoined !== null && players[lastJoined].name + " joined."}</p>
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

      <label htmlFor="rounds-select" className="mr-5">Number of Rounds:</label>
      <select className="w-auto border bg-white rounded px-3 py-2 outline-none" name="rounds-select">
        <option value="3" selected>
          3
        </option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
        <br/>

      <label htmlFor="judge-select" className="mr-5">Judge Time:</label>
      <select className="w-auto border bg-white rounded px-3 py-2 outline-none" name="judge-select">
        <option value="60" selected>
          60s
        </option>
        <option value="90">90s</option>
        <option value="120">120s</option>
      </select>
      <br/>

      <label htmlFor="pick-select" className="mr-5">Pick Time:</label>
      <select className="w-auto border bg-white rounded px-3 py-2 outline-none mb-2" name="pick-select">
        <option value="60" selected>
          60s
        </option>
        <option value="90">90s</option>
        <option value="120">120s</option>
      </select>
      <br/>

      {renderStartGameBtn()}
    </>
  );
}
