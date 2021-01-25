import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { socket } from "../utils";

export default function Home({ history } : {history: any}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {});

  const handleJoin = () => {
    setLoading(true);

    socket.emit("join room", {
      roomCode: code,
      clientName: name,
    });

    setTimeout(() => {
      history.push("/" + code);
    }, 2000);
  };

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
                onChange={(e) => {
                  setCode(e.target.value);
                }}
              />
              <div className='somespace'></div>
              <div className='somespace'></div>
              <button
                type='button'
                className='btn btn-secondary'
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
