import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { setCurrentChat, setRerenderChatList } from '../../redux/chat';
import { useNavigate } from 'react-router-dom';
import { TiUserDelete } from 'react-icons/ti';
import { Spinner } from '../../components/loader';
import Avatar from '@mui/material/Avatar';
import AlertDialog from '../../components/dialog';
import { Language } from '../../context/language';
import axios from 'axios';
import GetTimesAgo from '../../functions/getTimesAgo';

export const ChatUsers = (props) => {
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // import current user & parse it
  const currentuser = useSelector((state) => state.storeMain?.user);

  const definedChatUsers = useSelector((state) => state.storeChat.userChats);

  // update chat info. if user ve changed name, here will be show new name, after user who changed name opens target user chat.
  const UpdateChat = async (userNumber, roomId) => {
    try {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/chats/${roomId}`,
        {
          // Wrap property names in quotes
          [`user${userNumber}name`]: currentuser?.name,
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

  React.useEffect(() => {
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
        <Container>
          {definedChatUsers
            // ?.filter((item, index) => item?.lastMessage !== undefined)
            ?.filter((item, index) => {
              let currentUserNumber = item.user1id === currentuser?._id;
              let targetName;
              if (
                item[`${currentUserNumber ? 'user2name' : 'user1name'}`]
                  ?.toLowerCase()
                  ?.includes(props.search?.toLowerCase())
              ) {
                return item;
              }
            })
            ?.map((chat, index) => {
              // define targetUser info from chat
              let room = chat?.room?.startsWith(currentuser._id);
              let targetUser;
              if (!room) {
                targetUser = 'user1';
              } else {
                targetUser = 'user2';
              }
              let currentUserNumber = chat.user1id === currentuser?._id;
              return (
                <FoundedUser
                  key={chat.room}
                  chat={chat}
                  currentuser={currentuser}
                  targetUser={{
                    authId: chat[`${targetUser}authId`],
                    id: chat[`${targetUser}id`],
                    name: chat[`${targetUser}name`],
                    cover: chat[`${targetUser}cover`],
                  }}
                  onClick={() => {
                    // enter to room
                    props.handleRoomChange(chat.room);
                    // add currentchat in redux
                    dispatch(
                      setCurrentChat({
                        room: chat.room,
                        curentChatUser: currentuser?._id,
                        targetChatUser: {
                          authId: chat[`${targetUser}authId`],
                          id: chat[`${targetUser}id`],
                          name: chat[`${targetUser}name`],
                          cover: chat[`${targetUser}cover`],
                        },
                      })
                    );
                    UpdateChat(currentUserNumber ? 1 : 2, chat?.room);
                  }}
                ></FoundedUser>
              );
            })}
        </Container>
      )}
    </>
  );
};

const LoadingContainer = styled.div`
  height: 59vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 10px;
  width: 70%;
  padding: 10px 0;

  @media only screen and (max-width: 600px) {
    height: 70vh;
    width: 100%;
    padding: 0 5%;
    overflow-y: scroll;
    overflow-x: hidden;
    gap: 3vw;
  }
`;

const FoundedUser = (props) => {
  const dispatch = useDispatch();
  // define open message
  // const openMessage = useSelector((state) => state.storeChat.openMessage);
  const language = Language();

  const UpdateChat = async () => {
    try {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/chats/${props.chat.room}`,
        {
          // Wrap property names in quotes
          lastMessageStatus: 'read',
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

  // define BOLD
  let bold;
  if (
    props?.chat?.lastMessageStatus === 'unread' &&
    props?.chat?.lastMessageSenderId !== props?.currentuser?._id
    // props.currentuser?.id == lastSender?.senderId
  ) {
    bold = true;
  } else {
    bold = false;
  }

  // define shown post added time

  const currentPostTime = GetTimesAgo(
    new Date(props.chat?.lastMessageSentAt)?.getTime()
  );

  let timeTitle;
  if (currentPostTime?.title === 'h') {
    timeTitle = language?.language.Main.feedCard.h;
  } else if (currentPostTime?.title === 'min') {
    timeTitle = language?.language.Main.feedCard.min;
  } else {
    timeTitle = language?.language.Main.feedCard.justNow;
  }

  return (
    <UserContainer style={{ display: 'flex', alignItems: 'center' }}>
      <FoundedUserContainer
        onClick={() => {
          props.onClick();
          UpdateChat();
        }}
        bold={bold?.toString()}
      >
        <Avatar
          alt={props.targetUser.name}
          src={props.targetUser.cover}
          sx={{ width: 36, height: 36 }}
        />
        <h3 style={{ whiteSpace: 'nowrap', width: 'auto' }}>
          {props.targetUser.name}
        </h3>
        <p
          style={{
            maxWidth: '100px',
            width: 'auto',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {props.chat?.lastMessage.content}
        </p>
        <p
          style={{
            width: '15px',
            marginRight: '5px',
          }}
        >
          ...
        </p>
      </FoundedUserContainer>
      <div style={{ fontSize: '12px', width: 'auto', width: '50px' }}>
        {currentPostTime?.numbers + ' ' + timeTitle}
      </div>
      {/* <TiUserDelete id="removeIcon" onClick={() => setOpen(true)} /> */}
      <AlertDialog
        title={language?.language.Chat.chat.confirm}
        text={language?.language.Chat.chat.deletChatText}
        // open={open}
        // setOpen={setOpen}
        // function={() => DeleteChat()}
        language={language}
      />
    </UserContainer>
  );
};

const UserContainer = styled.div`
  color: ${(props) => props.theme.font};
  #removeIcon {
    font-size: 1.2vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;

const FoundedUserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 0 20px;
  font-weight: ${(props) => (props.bold === 'true' ? 'bold' : 'normal')};

  h3 {
    margin: 0;
    font-size: 14px;
    color: ${(props) => props.theme.font};
  }

  p {
    font-size: 12px;
    color: ${(props) => (props.bold === 'true' ? 'green' : '#666')};
  }

  :hover {
    filter: brightness(0.95);
  }

  @media only screen and (max-width: 600px) {
    border-radius: 50vw;
    padding: 0;
  }
`;

const Img = styled.img`
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  object-fit: cover;

  @media only screen and (max-width: 600px) {
    width: 10vw;
    height: 10vw;
  }
`;

const UserProfileEmpty = styled.div`
  width: 2.2vw;
  height: 2.2vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 9vw;
    height: 9vw;
  }

  .user {
    font-size: 1.2vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;
