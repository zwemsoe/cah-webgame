import { useState, useEffect, useContext, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { randomString } from "../utils";
import { SocketContext } from "../contexts/SocketContext";

interface Props {
  history: any;
}

export default function Home({ history }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [randomCode, setRandomCode] = useState("");
  const codeInputRef = useRef<HTMLInputElement | null>(null);
  const socket = useContext(SocketContext);
  useEffect(() => {});

  const handleJoin = () => {
    setLoading(true);

    const clientId = randomString(16);
    socket.emit("join room", {
      roomCode: code,
      clientName: name,
      clientId: clientId,
    });

    setTimeout(() => {
      history.push("/" + code, { clientId });
    }, 2000);
  };

  const handleCreateRoomCode = () => {
    const new_code = randomString(10);
    setRandomCode(new_code);
    setCode(new_code);
    //@ts-ignore
    codeInputRef.current.value = new_code;
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
            <input
              className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full mb-2"
              type="text"
              name="room-name"
              placeholder="Room Code"
              ref={codeInputRef}
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
            <div className="grid grid-flow-col grid-cols-2 mt-3 gap-2">
              <button
                className="bg-yellow-500 hover:bg-yellow-300 text-black font-bold h-10 rounded-full"
                onClick={handleJoin}
              >
                Join Room
              </button>
              <button
                className="bg-black hover:bg-gray-700 text-white font-bold h-10 rounded-full"
                onClick={handleCreateRoomCode}
              >
                Create a Room Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
