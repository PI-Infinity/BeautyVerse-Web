import React, { useEffect, useContext, useState, useRef } from "react";
import styled from "styled-components";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { Message } from "../../pages/chat/message";
import { useSelector, useDispatch } from "react-redux";
import { setScrollY, setCounter } from "../../redux/chat";
import { Spinner } from "../../components/loader";

export const Messages = (props) => {
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();
  const ref = useRef();
  const [messages, setMessages] = useState([]);
  const currentChat = useSelector((state) => state.storeChat.currentChat);
  const counter = useSelector((state) => state.storeChat.counter);
  const scrollY = useSelector((state) => state.storeChat.scrollY);

  useEffect(() => {
    if (currentChat?.length > 0) {
      const unSub = onSnapshot(
        doc(db, "chats", currentChat[0]?.chatId),
        (doc) => {
          doc.exists() && setMessages(doc.data()?.messages);
        }
      );
      return () => {
        unSub();
      };
    }
  }, [currentChat[0]?.chatId, counter]);

  //
  const handleScroll = (event) => {
    const { scrollHeight, scrollTop, clientHeight } = event.target;
    const scroll = scrollHeight - scrollTop - clientHeight;

    if (scroll > scrollY) {
      // We are not at the bottom of the scroll content
      // dispatch(setCounter(counter + 30));
      // dispatch(setScrollY(scrollY + 1000));
    } else if (scroll == 0) {
      // We are at the bottom
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <Container height={props?.height}>
          {messages?.map((m) => (
            <Message message={m} key={m.id} cover={currentChat[0]?.cover} />
          ))}
        </Container>
      )}
    </>
  );
};

const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  height: calc(100% - 140px);
  width: 100%;
  padding: 30px 20px 20px 20px;
  box-sizing: border-box;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media only screen and (max-width: 600px) {
    width: 100%;
    height: calc(${(props) => props.height}px - 30vw - 10vh);
    max-height: calc(${(props) => props.height}px - 30vw - 10vh);
    gap: 3vw;
  }
`;
