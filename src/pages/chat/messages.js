import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { Message } from "../../pages/chat/message";
import { useSelector, useDispatch } from "react-redux";
import { Spinner } from "../../components/loader";
import SimpleBackdrop from "../../components/backDrop";

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
          {messages?.map((m, i) => {
            let prevMsg = messages[i - 1];
            let nextMsg = messages[i + 1];
            if (prevMsg?.senderId === m?.senderId) {
              return (
                <Message
                  message={m}
                  key={m.id}
                  msg={messages[0]}
                  sameSender={true}
                  prevMsg={prevMsg}
                  nextMsg={nextMsg}
                />
              );
            } else {
              return (
                <Message
                  message={m}
                  key={m.id}
                  msg={messages[0]}
                  sameSender={false}
                  prevMsg={prevMsg}
                  nextMsg={nextMsg}
                />
              );
            }
          })}
          <SimpleBackdrop />
        </Container>
      )}
    </>
  );
};

const LoadingContainer = styled.div`
  height: 65vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    height: 80vh;
  }
`;

const Container = styled.div`
  height: calc(100% - 140px);
  width: 100%;
  padding: 30px 20px 20px 20px;
  box-sizing: border-box;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 2px;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    width: 100%;
    height: calc(${(props) => props.height}px - 30vw - 7vh);
    max-height: calc(${(props) => props.height}px - 30vw - 7vh);
    gap: 0.5vw;
  }
`;
