import React, { useState, useEffect, useContext } from "react";
import {SocketContext} from "../contexts/SocketContext";
import useLocalStorage from "../hooks/useLocalStorage";
import {User} from "../interfaces";

interface Props {
  history: any,
  match: any,
}

export default function Room({ match, history } : Props) {
  const roomCode = match.params.roomId;
  const [players, setPlayers] = useLocalStorage(`room-players-${roomCode}`, []);
  const [hostPlayer, setHostPlayer] = useLocalStorage(`host-player-${roomCode}`, undefined);
  const [currentPlayer, setCurrentPlayer] = useLocalStorage(`current-player-${history.location.state.clientId}`, undefined);;
  const [lastJoined, setLastJoined] = useState<number | null>(null);
  const socket = useContext(SocketContext);
  

  useEffect(() => {
    console.log("This runs again after reload")
    console.log("Socket", socket)
    socket && socket.emit("get room users", {
      roomCode: roomCode,
    });
  }, []);

  useEffect(() => {
    console.log("Socket", socket)
    console.log("Players", players)
    socket && socket.on("room status", ({ clients } : {clients: User[]}) => {
      console.log(`Clients: `, clients);
      setPlayers(clients);
      if(clients.length !== 0){
        setLastJoined(clients.length-1);
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


  return (
    <>
      <h1>{lastJoined !== null && players[lastJoined].name + " joined." }</h1>
      <h1>Players List:</h1>
      <ul>
        { players.map((player:any, i:number) => {
          return <li key={i}>{player.name} {(hostPlayer && hostPlayer.id) === player.id && "(Host)"}</li>
        })}
      </ul>

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
