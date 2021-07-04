import { useEffect, useState } from "react";
import Video from "./Video";
import styled from "styled-components";

const StyledVideo = styled.video`
    height: 125px;
    width: 200px;
    border: 1px solid blue;
`;

export default function VideoPanel(props) {
  return (
    <div className="flex flex-col gap-y-3">
      <StyledVideo muted ref={props.userVideo} autoPlay playsInline />
      {/* <button onClick={() => props.userVideo.current.srcObject = null}>Stop Video</button> */}
          {props.peers.map((peer: any) => {
                return (
                    <Video key={peer.peerId} peer={peer.peer} />
                );
          })}
    </div>
  );
}
