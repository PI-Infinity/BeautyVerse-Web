import React, { useState } from "react";
import styled from "styled-components";
import { SideBar } from "../../pages/chat/sideBar";
import { ChatContent } from "../../pages/chat/chatContent";

const Chat = () => {
  return (
    <Bg>
      <Container>
        <SideBar />
      </Container>
    </Bg>
  );
};

export default Chat;

const Bg = styled.div`
  width: 100%;
  height: 100.1vh;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    align-items: start;
    // overflow: hidden;
    // height: calc(100vh - 17vw);
    height: 100%;
    margin-top: 17vw;
  }
`;

const Container = styled.div`
  width: 70%;
  height: 80vh;
  border-radius: 0.5vw;
  overflow: hidden;
  border: 1px solid #ddd;
  display: flex;
  position: fixed;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100%;
    // height: calc(100vh - 17vw);
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;
    border: none;
  }
`;
