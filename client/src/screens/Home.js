import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import ioClient from "socket.io-client";
import { randomString } from "../utils";

const socket = ioClient("http://localhost:4001", {
  withCredentials: true,
});

const Home = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
  });

  const handleJoin = () => {
    socket.emit("join room", {
      roomCode: code,
      clientName: name,
      clientId: randomString(8),
    });
  };

  return (
    <div className='App'>
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
                class='btn btn-secondary'
                onClick={handleJoin}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
