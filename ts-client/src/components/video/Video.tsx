import { useEffect, useState, useRef } from "react";
import styled from "styled-components";

const StyledVideo = styled.video`
  height: 125px;
  width: 200px;
  border: 1px solid red;
`;

export default function Video(props) {
  // const custom_styling = {
  //   border: "1px solid blue",
  //   width: "100px",
  //   height: "100px",
  // };
  const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            //@ts-ignore
            ref.current && (ref.current.srcObject = stream);
        })
    }, []);

    return (
        //@ts-ignore
        <StyledVideo playsInline autoPlay ref={ref}/>
    );
}
