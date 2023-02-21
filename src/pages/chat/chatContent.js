import styled from "styled-components";
import { TopSection } from "../../pages/chat/topSection";
import { Messages } from "../../pages/chat/messages";
import { Input } from "../../pages/chat/input";
import { useParams, useLocation } from "react-router-dom";
import useWindowDimensions from "../../functions/dimensions";

export const ChatContent = (props) => {
  const { id } = useParams();
  const location = useLocation();
  const { height, width } = useWindowDimensions();

  return (
    <Bg
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container height={height}>
        <TopSection />
        <Messages height={height} />
        <Input />
      </Container>
    </Bg>
  );
};

const Bg = styled.div`
  width: 100%;
  height: 100.1vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    align-items: start;
    overflow: hidden;
    // height: calc(100vh - 14vw);
    height: 100%;
    margin-top: 14vw;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  height: 80vh;
  width: 70%;
  border-radius: 0.5vw;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.lineColor};

  @media only screen and (max-width: 600px) {
    flex: 1;
    position: fixed;
    top: 15vw;
    left: 0;
    width: 100vw;
    height: calc(${(props) => props.height}px - 15vw);
    min-height: calc(${(props) => props.height}px - 15vw);
    overflow: hidden;
    border: none;
    border-radius: none;
    border-top: 1px solid ${(props) => props.theme.background};
    justify-content: start;
    margin: 0;
  }
`;
