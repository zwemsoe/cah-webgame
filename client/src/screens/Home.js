import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import io from "socket.io-client";

const socket = io("http://localhost:4000", {
  withCredentials: true,
});

function Home() {
  const [name, setName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
    });
  });
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
              />
              <div className='somespace'></div>
              <div className='somespace'></div>
              <button type='button' class='btn btn-secondary'>
                Create a Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
