import { useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { ImFilePicture } from 'react-icons/im';
import { FiSend } from 'react-icons/fi';
import { setBackdropOpen } from '../../redux/main';
import { setRerenderChatList } from '../../redux/chat';
import { Language } from '../../context/language';
import EmojiPicker from 'emoji-picker-react';
import { FaRegSmileBeam } from 'react-icons/fa';
import { Theme } from 'emoji-picker-react';
import { IsMobile } from '../../functions/isMobile';
import axios from 'axios';
import { v4 } from 'uuid';

export const Input = (props) => {
  const language = Language();
  const dispatch = useDispatch();
  const isMobile = IsMobile();
  // import current user & parse it
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const currentChat = useSelector((state) => state.storeChat.currentChat);
  const userChats = useSelector((state) => state.storeChat.userChats);
  //
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);

  // update last message
  const UpdateChat = async (lastMessage, roomId) => {
    try {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/chats/${roomId}`,
        {
          // Wrap property names in quotes
          lastMessage: lastMessage,
          lastMessageStatus: 'unread',
          lastMessageSenderId: currentUser?._id,
          lastMessageSentAt: new Date(),
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

  // emojis
  const [open, setOpen] = useState(false);

  const handleKey = (e) => {
    if (text?.length > 0 || img != null) {
      e.code === 'Enter' && handleSend(e);
    }
    setOpen(false);
  };

  // open messig on focus
  // open message
  const searchInput = useRef(null);

  const OpeningMessage = async () => {
    if (props.messages?.length > 0) {
      try {
        const response = await axios.patch(
          `https://beautyverse.herokuapp.com/api/v1/chats/${currentChat.room}`,
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
    }
  };

  if (document.activeElement === searchInput.current) {
    OpeningMessage();
  }

  const handleSend = async (e) => {
    e.preventDefault();

    // if no chat, add it
    const AddChat = async (last, roomId) => {
      try {
        const response = await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/chats`,
          {
            room: roomId,
            user1id: currentUser?._id,
            user1name: currentUser?.name,
            user1cover: currentUser?.cover,
            user2id: currentChat.targetChatUser.id,
            user2authId: currentChat.targetChatUser.authId,
            user2name: currentChat.targetChatUser.name,
            user2cover: currentChat.targetChatUser.cover,
            lastMessage: last,
            lastMessageStatus: 'unread',
            lastMessageSenderId: currentUser?._id,
            lastMessageSentAt: new Date(),
          }
        );
        const data = await response.data;
        // dispatch(setRerenderChats());
      } catch (error) {
        console.error(error);
      }
    };

    let chatIsAlreadyDefined = userChats?.find((item) =>
      item.room.toLowerCase().includes(currentChat.room)
    );

    if (!chatIsAlreadyDefined && props.messages.length < 1) {
      AddChat(
        { username: currentUser._id, content: text, sentAt: new Date() },
        currentUser._id + '&' + currentChat.targetChatUser.id
      );
      props.socket?.emit('getchats', (data) => {
        console.log('getchats:', data);
      });
    }

    if (img != null) {
      if (
        img?.type?.endsWith('jpeg') ||
        img?.type?.endsWith('png') ||
        img?.type?.endsWith('jpg')
      ) {
        await dispatch(setBackdropOpen(true));

        const fileId = uuid();
        const storageRef = ref(
          storage,
          `images/chats/${currentChat.room}/${img?.name + fileId}`
        );

        const url = await uploadBytes(storageRef, img).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            const message = {
              username: currentUser._id,
              content: text,
              sentAt: new Date(),
              room: props.room,
              file: { url: downloadURL, id: img?.name + fileId },
            };
            UpdateChat(
              { username: currentUser._id, content: text, sentAt: new Date() },
              props.room
            );
            setText('');
            setImg(null);
            props.socket?.emit('message', message);
            props.setMessages((messages) => [...messages, message]);
          });
        });
        dispatch(setBackdropOpen(false));
      } else {
        alert('Unsuported File Format');
      }
    } else {
      if (text?.length < 2000) {
        if (text.trim() === '') {
          return;
        }
        let uniqueId = v4();
        // if not chat with this room, add new
        const message = {
          uniqueId: uniqueId,
          username: currentUser._id,
          content: text,
          sentAt: new Date(),
          room: props.room,
        };
        if (props.messages?.length > 0) {
          UpdateChat(
            { username: currentUser._id, content: text, sentAt: new Date() },
            props.room
          );
        }
        setText('');
        setImg(null);
        props.socket?.emit('message', message);
        props.socket?.emit('getchats', (data) => {
          console.log('getchats:', data);
        });
        props.setMessages((messages) => [...messages, message]);
      } else {
        alert('maximum symbols 2000');
      }
    }
    props.socket?.emit('getchats', (data) => {
      console.log('getchats:', data);
    });
  };

  return (
    <div>
      {open && !isMobile && (
        <Emojies>
          <EmojiPicker
            Theme="dark"
            onEmojiClick={(emoji) => setText((old) => old + emoji.emoji)}
          />
        </Emojies>
      )}
      <InputContainer>
        <InputField
          placeholder={language?.language.Chat.chat.typeText}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          onFocus={OpeningMessage}
          ref={searchInput}
        />
        <File>
          <input
            type="file"
            //   style={{ display: "none" }}
            id="file"
            onChange={(e) => setImg(e.target.files[0])}
          />
          <label htmlFor="file">
            <ImFilePicture
              className="label"
              style={{ color: img === null ? '' : 'gray' }}
            />
          </label>
          {!isMobile && (
            <FaRegSmileBeam
              onClick={() => setOpen(!open)}
              className="label"
              color="orange"
              style={{ position: 'relative', bottom: '1px' }}
            />
          )}
          <FiSend
            className="send"
            // onClick={(text?.length > 0 || img != null) && handleSend}
            onClick={handleSend}
          />
        </File>
      </InputContainer>
    </div>
  );
};

const Emojies = styled.div`
  position: absolute;
  bottom: 10vw;
  right: 16vw;
  zindex: 10000;

  @media only screen and (max-width: 600px) {
    bottom: 8vh;
    right: 3vw;
  }
`;

const InputContainer = styled.div`
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.secondLevel};
  box-sizing: border-box;
  padding: 10px 20px 10px 10px;
  border-top: 1px solid ${(props) => props.theme.lineColor};

  @media only screen and (max-width: 600px) {
    width: 100%;
    height: 7vh;
    min-height: 7vh;
    position: relative;
    width: 100%;
    left: 0;
    padding: 0 20px;
  }
`;

const InputField = styled.input`
  width: 100%;
  height: 70%;
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    padding-left: 3vw;
  }
`;

const File = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  .send {
    font-size: 20px;
    color: green;
    margin: 0 1vw;
    cursor: pointer;
  }

  #file {
    display: none;
  }
  .label {
    font-size: 20px;
    cursor: pointer;
    color: ${(props) => props.theme.font};

    :hover {
      filter: brightness(1.1);
    }
  }
`;
