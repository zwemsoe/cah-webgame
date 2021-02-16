import { useState, useEffect, useContext, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { SocketContext } from "../contexts/SocketContext";
import { v4 as uuid } from 'uuid';

interface Props {
  history: any,
  setClientName: any,
  match: any,
}

export default function Home({ history, setClientName, match }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setLoading] = useState(false);
  const socket = useContext(SocketContext);
  
  useEffect(() => {
    const roomCode = match.params.roomId;
    if(match.params.roomId){
      setCode(roomCode);
    } else {
      setCode(uuid());
    }
  }, []);

  const handleJoin = () => {
    if(name){
      setLoading(true);

      const clientId = uuid();
      socket.emit("join room", {
        roomCode: code,
        clientName: name,
        clientId: clientId,
      });

      setTimeout(() => {
        history.push("/" + code, { clientId });
        setClientName(name);
      }, 2000);
    } else {
      alert("Please fill in your name.")
    }
    
  };


  if (isLoading) {
    return (
      <>
        <p className="font-extrabold">Loading...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="grid place-items-center w-screen h-screen">
        <div>
          <div className="max-w-md bg-white border-2 border-gray-300 p-6 rounded-md tracking-wide shadow-lg">
            <input
              className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
              type="text"
              placeholder="Your Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <div className="grid grid-flow-col mt-3">
              <button
                className="bg-yellow-500 hover:bg-yellow-300 text-black font-bold h-10 rounded-full"
                onClick={handleJoin}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
