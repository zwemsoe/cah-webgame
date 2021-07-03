import { useState, useEffect, useContext } from "react";
import { Navbar } from "../components/Navbar";
import { SocketContext } from "../contexts/SocketContext";
import { nanoid } from 'nanoid';
import { cleanUpLocalStorage } from "../utils";

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
      setCode(nanoid());
    }
  }, [match.params.roomId]);

  useEffect(() => {
    cleanUpLocalStorage();
    return () => console.log("unmounting")
  }, [])

  const handleJoin = () => {
    if(name){
      setLoading(true);

      const clientId = nanoid(10);
      socket.emit("join room", {
        roomCode: code,
        clientName: name,
        clientId: clientId,
      });

      setTimeout(() => {
        history.push("/game/" + code, { clientId, clientName: name });
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
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
