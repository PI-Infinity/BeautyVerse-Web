import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { db } from '../../firebase';
import { onSnapshot, doc } from 'firebase/firestore';
import { Message } from '../../pages/chat/message';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from '../../components/loader';
import SimpleBackdrop from '../../components/backDrop';
import axios from 'axios';

export const Messages = (props) => {
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();
  const ref = useRef();
  const currentChat = useSelector((state) => state.storeChat.currentChat);
  const counter = useSelector((state) => state.storeChat.counter);
  const scrollY = useSelector((state) => state.storeChat.scrollY);

  // useEffect(() => {
  //   async function GetChat(userId) {
  //     const response = await fetch(
  //       `/api/v1/chats/chathistory/${currentChat?.room}`
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         props.setMessages(data.data.chats);
  //       })
  //       .catch((error) => {
  //         console.log('Error fetching data:', error);
  //       });
  //   }
  //   if (currentChat?.room) {
  //     GetChat();
  //   }
  // }, []);

  useEffect(() => {
    if (!props.socket) return;

    props.socket.on('messages', (messages) => {
      console.log('All messages received:', messages);
      props.setMessages(messages);
    });

    return () => {
      props.socket.off('messages');
    };
  }, [props.socket]);

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

  // update chat
  const UpdateChat = async () => {
    try {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/chats/${currentChat.room}`,
        {
          // Wrap property names in quotes
          lastMessage: props.messages[props.messages?.length - 1].content,
          lastMessageSenderId:
            props.messages[props.messages?.length - 1].username,
          lastMessageSentAt: props.messages[props.messages?.length - 1].sentAt,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.data;
    } catch (error) {
      console.error(error);
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
          {props.messages?.map((m, i) => {
            let prevMsg = props.messages[i - 1];
            let nextMsg = props.messages[i + 1];
            if (prevMsg?.username === m?.username) {
              return (
                <Message
                  message={m}
                  key={m.id}
                  msg={props.messages[0]}
                  sameSender={true}
                  prevMsg={prevMsg}
                  nextMsg={nextMsg}
                  socket={props.socket}
                  setMessages={props.setMessages}
                  UpdateChat={UpdateChat}
                />
              );
            } else {
              return (
                <Message
                  message={m}
                  key={m.id}
                  msg={props.messages[0]}
                  sameSender={false}
                  prevMsg={prevMsg}
                  nextMsg={nextMsg}
                  socket={props.socket}
                  setMessages={props.setMessages}
                  UpdateChat={UpdateChat}
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
