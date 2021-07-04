import { useState, useEffect, useContext, useRef } from "react";
import Lobby from "../components/Lobby";
import { SocketContext } from "../contexts/SocketContext";
import GameRoom from "../components/game/GameRoom";
import useLocalStorage from "../hooks/useLocalStorage";
import { User, Setting } from "../interfaces";
import VideoPanel from "../components/video/VideoPanel";
import Peer from "simple-peer";

interface Props {
  history: any;
  match: any;
}

var defaultSetting: Setting = {
  rounds: 3,
  toggleNSFW: false,
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};

export default function Room({ match, history }: Props) {
  const roomCode = match.params.roomId;
  const [users, setUsers] = useLocalStorage(`room-users`, []);
  const [hostUser, setHostUser] = useLocalStorage(
    `host-user`,
    null
  );
  const [currentUser, setCurrentUser] = useLocalStorage(
    `current-user`,
    null
  );
  const [lastJoined, setLastJoined] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [setting, changeSetting] = useState<Setting>(defaultSetting);
  const settingRef = useRef(defaultSetting);
  settingRef.current = setting;

  const [peers, setPeers] = useState<any>([]);
  const userVideo = useRef<any>();
  const peersRef = useRef<any>([]);

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
    const { clientId } = history.location.state;
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
      userVideo.current && (userVideo.current.srcObject = stream);
      
      socket.emit("join video chat", roomCode);

      socket.on("update peers", (users) => {
        let new_peers = [];
        users.forEach((user: any) => {
            if (user.id !== clientId){
              const peer = createPeer(user.id, clientId, stream);
              const peerExists = peersRef.current.findIndex((p) => p.peerId === user.id);
              if(peerExists > -1){
                peersRef.current.splice(peerExists, 1);
              }
              peersRef.current.push({
                peerId: user.id,
                peer,
              });
              //@ts-ignore
              new_peers.push({ peerId: user.id, peer});
            } 
        })
        setPeers(new_peers);
      })

      socket.on("peer joined", payload => {
        const peer = addPeer(payload.signal, payload.callerId, stream);
        const peerExists = peersRef.current.findIndex((p) => p.peerId === payload.callerId);
        if(peerExists > -1){
          peersRef.current.splice(peerExists, 1);
        }
        peersRef.current.push({
            peerId: payload.callerId,
            peer,
        })
        setPeers(users => [...users, {
          peerId: payload.callerId,
          peer,
        }]);
      });

      socket.on("receiving returned signal", payload => {
        const item = peersRef.current.find(p => p.peerId === payload.id);
        item.peer.signal(payload.signal);
      });

      socket.on("user left video", (userId) => {
        const item = peersRef.current.find(p => p.peerId === userId);
        if(item){
          item.peer.destroy();
        }
        const new_peers = peersRef.current.filter(p => p.peerId !== userId);
        peersRef.current = new_peers;
        setPeers(new_peers);
      })
    })
  }, [])

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

  const createPeer = (userToSignal: string, callerId: string, stream: any) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal: any) => {
      socket.emit("sending signal", { userToSignal, callerId, signal, roomCode })
    })

    return peer;
  }

  const addPeer = (incomingSignal: any, callerId: string, stream: any) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    })

    const { clientId } = history.location.state;

    peer.on("signal", (signal: any) => {
      socket.emit("returning signal", { signal, callerId, roomCode, clientId })
    })

    peer.signal(incomingSignal);

    return peer;
  }

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
      alert("Not enough players.")
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
            <GameRoom currentUser={currentUser} roomCode={roomCode} setting={settingRef.current} history={history} />
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
        <div style={{ position: "absolute", right: 0 }}>
          <VideoPanel userVideo={userVideo} peers={peers} />
        </div>
      </div>

    </>
  );
}
