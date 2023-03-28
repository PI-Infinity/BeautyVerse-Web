import React, { useContext, useRef, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ref, deleteObject } from 'firebase/storage';
import { storage, db } from '../../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayRemove,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { MdRemove } from 'react-icons/md';
import AlertDialog from '../../components/dialog';
import { Language } from '../../context/language';
import ChatMsg from '@mui-treasury/components/chatMsg/ChatMsg';
import GetTimesAgo from '../../functions/getTimesAgo';

export const Message = ({
  message,
  sameSender,
  prevMsg,
  nextMsg,
  socket,
  setMessages,
  messages,
  UpdateChat,
}) => {
  const messageref = useRef();

  useEffect(() => {
    messageref.current?.scrollIntoView();
  }, [message]);

  const language = Language();
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const currentuser = useSelector((state) => state.storeMain?.user);
  const currentChat = useSelector((state) => state.storeChat?.currentChat);

  const [user, setUser] = useState('');

  // define shown post added time

  const currentPostTime = GetTimesAgo(new Date(message.sentAt)?.getTime());

  let timeTitle;
  if (currentPostTime?.title === 'h') {
    timeTitle = language?.language.Main.feedCard.h;
  } else if (currentPostTime?.title === 'min') {
    timeTitle = language?.language.Main.feedCard.min;
  } else {
    timeTitle = language?.language.Main.feedCard.justNow;
  }

  let cover;
  if (!sameSender) {
    if (message?.username === currentuser?._id) {
      cover = (
        <Avatar
          alt={currentuser?.name}
          src={currentChat.targetChatUser?.cover}
          sx={{ width: 30, height: 30 }}
        />
      );
    } else {
      cover = (
        <Avatar
          alt={currentChat.targetChatUser?.name}
          src={currentChat.targetChatUser?.cover}
          sx={{ width: 30, height: 30 }}
        />
      );
    }
  } else {
    cover = <div style={{ width: 30, height: 30 }} />;
  }

  // delete message
  const chatUser = useSelector((state) => state.storeChat.currentChat);
  const DeleteMessage = async (messageId, fileId) => {
    // Emit a 'deleteMessage' event to the server with the messageId
    await socket.emit('deleteMessage', {
      id: messageId,
      room: currentChat.room,
    });

    const storageRef = ref(
      storage,
      `images/chats/${currentChat.room}/${fileId}`
    );

    // Delete the file
    if (fileId) {
      deleteObject(storageRef).then(() => {
        console.log('object deleted');
      });
    }

    setMessages((prevMessages) => {
      return prevMessages.filter((message) => message.uniqueId !== messageId);
    });

    UpdateChat();
  };

  // open dialog
  const [open, setOpen] = React.useState(false);

  // define message design
  let design;
  if (message?.username === currentuser?._id) {
    if (
      prevMsg?.username === nextMsg?.username &&
      prevMsg?.username === message?.username
    ) {
      design = '30px 8px 8px 30px';
    } else if (
      prevMsg?.username !== message?.username &&
      message?.username === nextMsg?.username
    ) {
      design = '30px 25px 8px 30px';
    } else if (
      prevMsg?.username === message?.username &&
      message?.username !== nextMsg?.username
    ) {
      design = '30px 8px 25px 30px';
    } else {
      design = '30px 30px 30px 30px';
    }
  } else {
    if (
      prevMsg?.username === nextMsg?.username &&
      prevMsg?.username === message?.username
    ) {
      design = '8px 30px 30px 8px';
    } else if (
      prevMsg?.username !== message?.username &&
      message?.username === nextMsg?.username
    ) {
      design = '25px 30px 30px 8px';
    } else if (
      prevMsg?.username === message?.username &&
      message?.username !== nextMsg?.username
    ) {
      design = '8px 30px 30px 25px';
    } else {
      design = '30px 30px 30px 30px';
    }
  }

  // define
  let lastMsg;
  if (
    (prevMsg?.username === message?.username ||
      prevMsg?.username === undefined ||
      prevMsg?.username !== message?.username) &&
    (nextMsg?.username !== message?.username || nextMsg?.username === undefined)
  ) {
    lastMsg = true;
  }

  return (
    <MainContainer prop={message?.username === currentuser?._id}>
      <MessageContainer
        ref={messageref}
        prop={(message?.username === currentuser?._id)?.toString()}
        sameSender={sameSender?.toString()}
        design={design}
        onClick={
          message?.username === currentuser?._id
            ? () => setOpen(true)
            : undefined
        }
      >
        {message?.username !== currentuser?._id}
        <div>
          {message?.file?.url && (
            <img
              id="img"
              style={{ margin: '2px 0' }}
              src={message?.file?.url}
            />
          )}
          <MessageContent
            content={message?.content?.length.toString()}
            className={
              message?.username === currentuser?._id ? 'current' : 'noCurrent'
            }
            // onClick={() => setOpen(true)}
          >
            {message?.content}
          </MessageContent>
        </div>
        {lastMsg && (
          <span
            style={{
              color: '#ddd',
              opacity: '0.7',
              marginTop: '5px',
            }}
            className="time"
          >
            {currentPostTime?.numbers + ' ' + timeTitle}
          </span>
        )}
      </MessageContainer>

      <AlertDialog
        function={() => DeleteMessage(message.uniqueId, message?.file?.id)}
        open={open}
        setOpen={setOpen}
        title={language?.language.Chat.chat.confirm}
        text={language?.language.Chat.chat.confirmText}
        language={language}
      />
    </MainContainer>
  );
};

const MainContainer = styled.div`
  // width: 100%;
  // display: flex;
  // // flex-direction: column;
  // // align-items: ${(props) => (props.prop ? 'flex-end' : 'start')};

  // @media only screen and (max-width: 600px) {
  // }
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  flex-direction: ${(props) => (props.prop === 'true' ? 'row-reverse' : 'row')};
  justify-content: ${(props) => (props.prop === 'true' ? 'auto' : 'start')};
  margin-top: ${(props) => (props.sameSender === 'true' ? 'auto' : '5px')};

  @media only screen and (max-width: 600px) {
    gap: 10px;
  }

  .current {
    background: #3f51b5;
    border-radius: ${(props) => props.design};
    color: #fff;
  }
  .noCurrent {
    background: #fff;
    border-radius: ${(props) => props.design};
  }

  & > span {
    font-size: 12px;
  }

  #img {
    max-width: 25vw;
    border-radius: 5px;
    @media only screen and (max-width: 600px) {
      max-width: 60vw;
      // height: 30vw;
      object-fit: cover;
      border-radius: 2vw;
    }
  }

  .time {
    font-size: 12px;
  }
`;

const Img = styled.img`
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    width: 8vw;
    height: 8vw;
  }
`;
const MessageContent = styled.div`
  padding: ${(props) => (props?.content === '0' ? '0' : '10px 20px 10px 20px')};
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  font-size: 14px;
  cursor: pointer;
  max-width: 500px;

  @media only screen and (max-width: 600px) {
    font-size: 14px;
    max-width: 55vw;
    padding: ${(props) => (props?.content === '0' ? '0' : '7px 20px 8px 20px')};
  }
`;

const UserProfileEmpty = styled.div`
  width: 2vw;
  height: 2vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 8vw;
    height: 8vw;
  }

  .user {
    font-size: 1.2vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;
