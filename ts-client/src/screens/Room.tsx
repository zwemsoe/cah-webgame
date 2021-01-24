import React, { useState, useEffect } from "react";
import { socket } from "../socketClient";

interface User {
  id: string,
  name: string,
  roomId: string,
}

export default function Room({ match } : {match:any}) {
  const roomCode = match.params.roomId;

  socket.on("room status", ({ clients } : {clients: User[]}) => {
    console.log(`Clients: `, clients);
  });

  useEffect(() => {
    socket.emit("get room users", {
      roomCode: roomCode,
    });
  }, []);

  return (
    <>
      <h1>Hello</h1>
    </>
  );
}
