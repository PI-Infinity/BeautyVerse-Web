import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SideBar } from '../../pages/chat/sideBar';
import { ChatContent } from '../../pages/chat/chatContent';
import TestChat from '../../pages/chat/test';
import { useSelector, useDispatch } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { setUserChats } from '../../redux/chat';

const Chat = ({ socket, handleRoomChange, room }) => {
  const dispatch = useDispatch();

  document.body.style.overflowY = 'hidden';

  const messagesEndRef = useRef(null);
  const currentuser = useSelector((state) => state.storeMain.user);
  const rerenderChatList = useSelector(
    (state) => state.storeChat.rerenderChatList
  );

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    return () => {
      socket.off();
    };
  }, [socket]);

  /**
   * remove message
   *  */

  function removeMessageFromUI(messageId) {
    setMessages((prevMessages) => {
      return prevMessages.filter((message) => message.uniqueId !== messageId);
    });
  }

  useEffect(() => {
    if (!socket) return;

    socket.on('messageDeleted', (deletedMessage) => {
      console.log('Message deleted:', deletedMessage);

      // Update the UI to remove the deleted message from the list
      removeMessageFromUI(deletedMessage.uniqueId);
    });

    return () => {
      socket.off('messageDeleted');
    };
  }, [socket]);

  /**
   * scroll to bottom in chat
   *  */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Bg>
      <Container>
        {room === '' ? (
          <SideBar
            socket={socket}
            handleRoomChange={handleRoomChange}
            room={room}
          />
        ) : (
          <ChatContent
            socket={socket}
            room={room}
            messages={messages}
            setMessages={setMessages}
          />
        )}
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
