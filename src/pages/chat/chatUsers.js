import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { SetCurrentChat } from "../../redux/chat";
import { useNavigate } from "react-router-dom";
import { TiUserDelete } from "react-icons/ti";
import { Spinner } from "../../components/loader";
import Avatar from "@mui/material/Avatar";
import AlertDialog from "../../components/dialog";
import { Language } from "../../context/language";

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

  // define userList
  const list = useSelector((state) => state.storeMain.userList);
  let userList;
  if (list?.length > 0) {
    userList = JSON.parse(list);
  }

  let definedChatUsers;
  if (chats?.length > 0) {
    definedChatUsers = chats?.map((item, index) => {
      let us = userList?.find((it) => it.id === item.userInfo.id);
      return {
        chatId: item?.chatId,
        date: item?.date,
        lastMessage: item?.lastMessage,
        opened: item?.opened,
        senderId: item?.senderId,
        chatId: item?.chatId,
        userInfo: {
          id: item?.userInfo?.id,
          name: us?.name,
          cover: us?.cover,
        },
      };
    });
  }

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
          {definedChatUsers
            ?.filter((item, index) => item?.lastMessage !== undefined)
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
  const language = Language();

  const newMessage = openMessage?.some(
    (item) => item == props.chat?.userInfo?.id
  );

  const [open, setOpen] = React.useState(false);

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

  // define BOLD
  let bold;
  if (
    props?.chat?.opened === false &&
    props?.chat?.senderId !== props?.currentuser?.id
    // props.currentuser?.id == lastSender?.senderId
  ) {
    bold = true;
  } else {
    bold = false;
  }

  return (
    <UserContainer style={{ display: "flex", alignItems: "center" }}>
      <FoundedUserContainer onClick={props.onClick} bold={bold?.toString()}>
        <Avatar
          alt={props?.chat?.userInfo?.name}
          src={props?.chat?.userInfo?.cover}
          sx={{ width: 36, height: 36 }}
        />
        <h3 style={{ whiteSpace: "nowrap", width: "auto" }}>
          {props?.chat?.userInfo?.name}
        </h3>
        <p
          style={{
            color: "#666",
            width: "100px",

            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {props.chat?.lastMessage}
        </p>
        <p
          style={{
            color: "#666",
            width: "15px",
            marginRight: "5px",
          }}
        >
          ...
        </p>
      </FoundedUserContainer>
      <TiUserDelete id="removeIcon" onClick={() => setOpen(true)} />
      <AlertDialog
        title={language?.language.Chat.chat.confirm}
        text={language?.language.Chat.chat.deletChatText}
        open={open}
        setOpen={setOpen}
        function={() => DeleteChat()}
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
  font-weight: ${(props) => (props.bold === "true" ? "bold" : "normal")};

  h3 {
    margin: 0;
    font-size: 14px;
    color: ${(props) => props.theme.font};
  }

  p {
    font-size: 12px;
    color: ${(props) => props.theme.secondLevel};
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
