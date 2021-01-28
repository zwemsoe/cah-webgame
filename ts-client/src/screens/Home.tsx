import { useState, useEffect, useContext, useRef} from "react";
import { Navbar } from "../components/Navbar";
import { randomString } from "../utils";
import {SocketContext} from "../contexts/SocketContext";

interface Props{
  history: any,
}

export default function Home({ history } : Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [randomCode, setRandomCode] = useState("");
  const codeInputRef = useRef<HTMLInputElement | null>(null);
  const socket = useContext(SocketContext);
  useEffect(() => {});

  const handleJoin = () => {
    setLoading(true);

    const clientId = randomString(8);
    socket && socket.emit("join room", {
      roomCode: code,
      clientName: name,
      clientId: clientId,
    });

    setTimeout(() => {
      history.push("/" + code, {clientId});
    }, 2000);
  };

  const handleCreateRoomCode = () => {
    const new_code = randomString(8);
    setRandomCode(new_code);
    setCode(new_code);
    //@ts-ignore
    codeInputRef.current.value = new_code;
  }

  if (isLoading) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className='centered whole-screen'>
        <div>
          <div className='card home-card'>
            <div className='card-body'>
              <input
                className='form-control'
                type='text'
                placeholder='Your Name'
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <div className='somespace'></div>
              <div className='somespace'></div>
              <input
                className='form-control'
                type='text'
                name='room-name'
                placeholder='Room Code'
                ref = {codeInputRef}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <div className='somespace'></div>
              <div className='somespace'></div>
              <button
                type='button'
                className='btn btn-warning'
                onClick={handleJoin}
              >
                Join Room
              </button>
              <button
                type='button'
                className='btn btn-secondary'
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
