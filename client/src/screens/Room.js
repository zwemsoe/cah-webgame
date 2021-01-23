import React, { useState, useEffect } from "react";
import { socket } from "../socketClient";

export default function Room({ match }) {
  const roomCode = match.params.roomId;

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
