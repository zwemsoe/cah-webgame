import { useState, useEffect, useContext, useRef } from "react";
import Lobby from "../components/Lobby";
import { SocketContext } from "../contexts/SocketContext";
import GameRoom from "../components/game/GameRoom";
import useLocalStorage from "../hooks/useLocalStorage";
import { User, Setting } from "../interfaces";

interface Props {
  history: any;
  match: any;
}

var defaultSetting: Setting = {
  rounds: 3,
  toggleNSFW: false,
};

export default function Room({ match, history }: Props) {
  const roomCode = match.params.roomId;
  const [users, setUsers] = useLocalStorage(`room-users`, []);
  const [hostUser, setHostUser] = useLocalStorage(`host-user`, null);
  const [currentUser, setCurrentUser] = useLocalStorage(`current-user`, null);
  const [lastJoined, setLastJoined] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [setting, changeSetting] = useState<Setting>(defaultSetting);
  const settingRef = useRef(defaultSetting);
  settingRef.current = setting;

  const socket = useContext(SocketContext);

  useEffect(() => {
    const { clientId, clientName } = history.location.state;
    socket.emit("join room", {
      roomCode: roomCode,
      clientName: clientName,
      clientId: clientId,
    });
  }, []);

  useEffect(() => {
    socket.emit("get room users", {
      roomCode: roomCode,
    });
    socket.emit("get room setting", { roomCode: roomCode });
  }, [roomCode, socket]);

  useEffect(() => {
    socket.on("room status", ({ clients }: { clients: User[] }) => {
      setUsers(clients);
      if (clients.length > 0) {
        clients.length > 1 && setLastJoined(clients.length - 1);
        setHostUser(clients[0]);
        var id: string | undefined = history.location.state.clientId;
        id && setCurrentUser(clients.find((client) => client.id === id));
      }
    });
  }, [users, socket]);

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
    const { name, value, checked } = e.target;
    const parse_value = parseInt(value);
    if (checked !== undefined) {
      changeSetting((prevState) => ({
        ...prevState,
        toggleNSFW: checked,
      }));
    } else {
      changeSetting((prevState) => ({
        ...prevState,
        [name]: parse_value,
      }));
    }
    setTimeout(() => {
      socket.emit("change setting", {
        settings: settingRef.current,
        roomCode: roomCode,
      });
    }, 500);
  };

  const handleStartGame = () => {
    if (users.length > 0) {
      setGameStarted(true);
      socket.emit("start game", { roomCode: roomCode });
      socket.emit("game state init", { roomCode: roomCode });
    } else {
      alert("Not enough players.");
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leave room", { roomCode });
    history.push("/");
  };

  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          {gameStarted ? (
            <GameRoom
              currentUser={currentUser}
              roomCode={roomCode}
              setting={settingRef.current}
              history={history}
            />
          ) : (
            <>
              <Lobby
                setting={setting}
                handleSetting={handleSetting}
                players={users}
                hostPlayer={hostUser}
                currentPlayer={currentUser}
                lastJoined={lastJoined}
                handleStartGame={handleStartGame}
                match={match}
                handleLeaveRoom={handleLeaveRoom}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
