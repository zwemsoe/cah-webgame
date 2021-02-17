import { useState, useEffect, useContext, useRef } from "react";
import Lobby from "../components/Lobby";
import { SocketContext } from "../contexts/SocketContext";
import GameRoom from "../game/ui/GameRoom";
import useLocalStorage from "../hooks/useLocalStorage";
import { User, Setting, Player, BlackCard, WhiteCard } from "../interfaces";

interface Props {
  history: any;
  match: any;
}

var defaultSetting: Setting = {
  rounds: 3,
  judgeTime: 60,
  pickTime: 60,
};

export default function Room({ match, history }: Props) {
  const roomCode = match.params.roomId;
  const [users, setUsers] = useLocalStorage(`room-Users-${roomCode}`, []);
  const [hostUser, setHostUser] = useLocalStorage(
    `host-User-${roomCode}`,
    undefined
  );
  const [currentUser, setCurrentUser] = useLocalStorage(
    `current-User-${history.location.state.clientId}`,
    undefined
  );
  const [lastJoined, setLastJoined] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [setting, changeSetting] = useState<Setting>(defaultSetting);
  const settingRef = useRef(defaultSetting);
  settingRef.current = setting;
  
  //GameRoom related


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
      setUsers(clients);
      if (clients.length !== 0) {
        setLastJoined(clients.length - 1);
        setHostUser(clients[0]);
        var id: string | undefined = history.location.state.clientId;
        setCurrentUser(clients.find((client) => client.id === id));
      }
    });
  }, [users]);

  useEffect(() => {
    socket.on("setting update", ({ settings }: { settings: Setting }) => {
      if (hostUser && currentUser) {
        if (hostUser.id !== currentUser.id) {
          changeSetting(settings);
        }
      }
    });
    socket.on("game start update", () => {
      setGameStarted(true);
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
      socket.emit("change setting", {
        settings: settingRef.current,
        roomCode: roomCode,
      });
    }, 500);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    socket.emit("start game", { roomCode: roomCode });
    socket.emit("game state init", { roomCode: roomCode });
  };
  

  return (
    <>
      {gameStarted ? (
        <GameRoom currentUser = {currentUser} roomCode = {roomCode}/>
      ) : (
        <Lobby
          setting={setting}
          handleSetting={handleSetting}
          players={users}
          hostPlayer={hostUser}
          currentPlayer={currentUser}
          lastJoined={lastJoined}
          handleStartGame={handleStartGame}
          match={match}
        />
      )}
    </>
  );
}
