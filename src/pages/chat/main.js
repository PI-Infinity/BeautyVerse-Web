import styled from "styled-components";
import { SideBar } from "../../pages/chat/sideBar";

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
  background: ${(props) => props.theme.background};
  @media only screen and (max-width: 600px) {
    align-items: start;
    height: 100%;
    margin-top: 14vw;
  }
`;

const Container = styled.div`
  width: 70%;
  height: 80vh;
  border-radius: 0.5vw;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.lineColor};
  display: flex;
  position: fixed;
  box-sizing: border-box;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    width: 100%;
    // height: calc(100vh - 17vw);
    height: 100%;
    box-sizing: border-box;
    flex-direction: column;
    border: none;
    border-radius: 0;
  }
`;
