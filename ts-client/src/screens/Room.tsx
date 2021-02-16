import { useState, useEffect, useContext, useRef } from "react";
import Lobby from "../components/Lobby";
import { SocketContext } from "../contexts/SocketContext";
import GameRoom from "../game/ui/GameRoom";
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
};

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
  const [gameStarted, setGameStarted] = useState<boolean>(false);
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
    socket.on("game start update", () => {
      if (hostPlayer && currentPlayer) {
        if (hostPlayer.id !== currentPlayer.id) {
          setGameStarted(true);
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
      socket.emit("change setting", {
        settings: settingRef.current,
        roomCode: roomCode,
      });
    }, 500);
  };

  const handleStartGame = () => {
    setGameStarted(true);
    socket.emit("start game", { roomCode: roomCode });
  };

  return (
    <>
      {gameStarted ? (
        <GameRoom />
      ) : (
        <Lobby
          setting={setting}
          handleSetting={handleSetting}
          players={players}
          hostPlayer={hostPlayer}
          currentPlayer={currentPlayer}
          lastJoined={lastJoined}
          handleStartGame={handleStartGame}
          match = {match}
        />
      )}
    </>
  );
}
