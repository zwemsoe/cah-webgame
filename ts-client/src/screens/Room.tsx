import React, { useState, useEffect, useContext } from "react";
import { randomString } from "../utils";
import {SocketContext} from "../contexts/SocketContext";

interface User {
  id: string,
  name: string,
  roomId: string,
}

interface Props {
  match: any,
  history: any,
  roomCode: string,
}

export default function Room({ match, history, roomCode } : Props) {
  const [players, setPlayers] = useState<User[]>([]);
  const [lastPlayer, setLastPlayer] = useState<number | null>(null);
  const [hostPlayer, setHostPlayer] = useState<User | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<User | undefined>(undefined);
  const socket = useContext(SocketContext);
  

  useEffect(() => {
    console.log("This runs again after reload")
    console.log("Scoekt", socket)
    socket && socket.emit("get room users", {
      roomCode: roomCode,
    }); 
  }, []);

  useEffect(() => {
    console.log("Scoekt", socket)
    socket && socket.on("room status", ({ clients } : {clients: User[]}) => {
      console.log(`Clients: `, clients);
      setPlayers(clients);
      if(clients.length !== 0){
        setLastPlayer(clients.length-1);
        setHostPlayer(clients[0]);
        var id: string | undefined = history.location.state.clientId;
        setCurrentPlayer(clients.find((client) => client.id === id));
      }
    });
  }, [players]);

  

  const renderStartGameBtn = () => {
    if(hostPlayer && currentPlayer){
        if(hostPlayer.id === currentPlayer.id){
          return (
          <div> 
            <a className = "btn btn-warning">
              Start Game
            </a>
          </div>
          )
        }
    }
  }

  console.log("Players:", players);
  console.log("RoomCode:", roomCode);

  return (
    <>
      <h1>{lastPlayer !== null && players[lastPlayer].name + " joined." }</h1>
      <h1>Players List:</h1>
      { players.map((player, i) => {
        return <h2 key={i}>{player.name}</h2>
      })}

      <div className='somespace'></div>
      <div className='somespace'></div>

      <h2>Settings</h2>
      <label htmlFor="rounds-select">Number of Rounds:</label>
      <select className="form-select" name="rounds-select">
        <option value="3" selected>3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      <label htmlFor="judge-select">Judge Time:</label>
      <select className="form-select" name="judge-select">
        <option value="60" selected>60s</option>
        <option value="90">90s</option>
        <option value="120">120s</option>
      </select>

      <label htmlFor="pick-select">Pick Time:</label>
      <select className="form-select" name="pick-select">
        <option value="60" selected>60s</option>
        <option value="90">90s</option>
        <option value="120">120s</option>
      </select>
      
      <div className='somespace'></div>
      <div className='somespace'></div>
      {renderStartGameBtn()}
    </>
  );
}
