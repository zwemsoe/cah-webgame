import React, { useState, useEffect } from "react";
import { socket } from "../utils";

interface User {
  id: string,
  name: string,
  roomId: string,
}

interface Player{
  name: string,
}

export default function Room({ match } : {match:any}) {
  const roomCode = match.params.roomId;
  const [players, setPlayers] = useState<User[]>([]);
  const [lastPlayer, setLastPlayer] = useState<number | null>(null);

  useEffect(() => {
    socket.emit("get room users", {
      roomCode: roomCode,
    });
  }, []);

  useEffect(() => {
    socket.on("room status", ({ clients } : {clients: User[]}) => {
      console.log(`Clients: `, clients);
      setPlayers(clients);
      if(clients.length !== 0){
        setLastPlayer(clients.length-1);
      }
    });
  }, [players]);

  return (
    <>
      <h1>{lastPlayer !== null && players[lastPlayer].name + " joined." }</h1>
      <h1>Players List:</h1>
      { players.map((player, i) => {
        return <h2 key={i}>{player.name}</h2>
      })}
    </>
  );
}
