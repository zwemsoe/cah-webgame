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
    <div className="flex flex-col ...">
      <StyledVideo muted ref={props.userVideo} autoPlay playsInline />
          {props.peers.map((peer: any, index: number) => {
                return (
                    <Video key={index} peer={peer} />
                );
          })}
    </div>
  );
}
