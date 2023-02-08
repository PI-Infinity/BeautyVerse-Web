import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { ChatContext } from "../../context/ChatContext";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import {
  setOpenMessage,
  SetCurrentChat,
  setCounter,
  setScrollY,
} from "../../redux/chat";
import { useNavigate } from "react-router-dom";
import { TiUserDelete } from "react-icons/ti";
import Loader from "react-js-loader";
import { FaUser } from "react-icons/fa";
import { Spinner } from "../../components/loader";

export const ChatUsers = (props) => {
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // import current user & parse it
  const chatRerender = useSelector((state) => state.storeChat.rerender);
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  const [chats, setChats] = React.useState([]);

  React.useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        collection(db, "users", currentuser?.id, "chats"),
        (snapshot) => {
          let result = snapshot.docs.map((doc) => doc.data());
          setChats(result?.sort((a, b) => b?.date - a?.date));
        }
      );
      return () => {
        unsub();
      };
    };
    currentuser?.id && getChats();
  }, [currentuser?.id]);

  // open message
  const Opening = async (chatid) => {
    await updateDoc(doc(db, "users", currentuser?.id, "chats", chatid), {
      opened: true,
    });
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
          {chats
            ?.filter((item, index) => {
              if (
                item?.userInfo?.name
                  ?.toLowerCase()
                  ?.includes(props.search?.toLowerCase())
              ) {
                return item;
              }
            })
            ?.map((chat, index) => (
              <FoundedUser
                key={chat.chatId}
                chat={chat}
                currentuser={currentuser}
                onClick={() => {
                  Opening(chat?.userInfo?.id);
                  navigate(`/chat/${chat.chatId}`);
                  // dispatch(setCounter(30));
                  // dispatch(setScrollY(500));
                  dispatch(
                    SetCurrentChat([
                      {
                        chatId: chat.chatId,
                        cover: chat.userInfo?.cover,
                        name: chat.userInfo?.name,
                        userId: chat.userInfo?.id,
                      },
                    ])
                  );
                }}
              ></FoundedUser>
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
  const openMessage = useSelector((state) => state.storeChat.openMessage);

  const newMessage = openMessage?.some(
    (item) => item == props.chat?.userInfo?.id
  );

  const DeleteChat = async () => {
    const chatDoc = doc(
      db,
      "users",
      props.currentuser?.id,
      "chats",
      props.chat?.userInfo.id
    );
    await deleteDoc(chatDoc);
  };

  // define last sender
  const [lastSender, setLastSender] = React.useState("");
  const currentChat = useSelector((state) => state.storeChat.currentChat);

  React.useEffect(() => {
    if (currentChat?.length > 0) {
      const unSub = onSnapshot(
        doc(db, "chats", currentChat[0]?.chatId),
        (doc) => {
          doc.exists() &&
            setLastSender(
              doc.data()?.messages[doc.data()?.messages?.length - 1]
            );
        }
      );

      return () => {
        unSub();
      };
    }
  }, [currentChat[0]?.chatId]);

  // define BOLD
  let bold;
  if (
    props.chat?.opened == true ||
    props.currentuser?.id == lastSender?.senderId
  ) {
    bold = true;
  } else if (
    props.chat?.opened == false &&
    props.currentuser?.id !== lastSender?.senderId
  ) {
    bold = false;
  }

  return (
    <UserContainer style={{ display: "flex", alignItems: "center" }}>
      <FoundedUserContainer onClick={props.onClick} opened={bold}>
        {props.chat?.userInfo?.cover != undefined ? (
          <Img src={props.chat?.userInfo?.cover} alt="" />
        ) : (
          <UserProfileEmpty>
            <FaUser className="user" />
          </UserProfileEmpty>
        )}

        <span>{props.chat?.userInfo?.name}</span>
        <p>{props.chat?.lastMessage}</p>
      </FoundedUserContainer>
      <TiUserDelete id="removeIcon" onClick={DeleteChat} />
    </UserContainer>
  );
};

const UserContainer = styled.div`
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
  font-weight: ${(props) => (props.opened ? "normal" : "bold")};

  p {
    font-size: 0.7vw;
    color: #ccc;

    @media only screen and (max-width: 600px) {
      font-size: 2.5vw;
    }
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
