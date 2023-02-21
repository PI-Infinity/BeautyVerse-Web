import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { ref, deleteObject } from "firebase/storage";
import { storage, db } from "../../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  arrayRemove,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { MdRemove } from "react-icons/md";
import AlertDialog from "../../components/dialog";
import { Language } from "../../context/language";

export const Message = ({ message }) => {
  const language = Language();
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const unparsedUser = useSelector((state) => state.storeMain.user);

  let currentuser;
  if (unparsedUser?.length > 0) {
    currentuser = JSON.parse(unparsedUser);
  }

  /// define user list
  const list = useSelector((state) => state.storeMain.userList);
  let userList;
  if (list?.length > 0) {
    userList = JSON.parse(list);
  }

  const messageref = useRef();

  useEffect(() => {
    messageref.current?.scrollIntoView();
  }, [message]);

  const [user, setUser] = useState("");

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("id", "==", message?.senderId)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [message]);

  const sendDate = new Date(message?.date.seconds * 1000)
    .toString()
    .slice(4, 21);
  const currentTime = new Date().getTime() / 1000;

  let cover;
  if (message?.senderId === currentuser?.id) {
    cover = (
      <Avatar
        alt={currentuser?.name}
        src={currentuser?.cover}
        sx={{ width: 36, height: 36 }}
      />
    );
  } else {
    let us = userList?.find((item) => item?.id === message?.senderId);
    cover = (
      <Avatar alt={us?.name} src={us?.cover} sx={{ width: 36, height: 36 }} />
    );
  }

  // delete message
  const chatUser = useSelector((state) => state.storeChat.currentChat);
  const DeleteMessage = async (obj) => {
    if (obj?.img !== undefined) {
      await deleteObject(
        ref(storage, `images/chats/${chatUser[0]?.chatId}/${obj?.imgName}`)
      ).then(() => {
        console.log("storage success");
      });
    }
    updateDoc(doc(db, "chats", chatUser[0]?.chatId), {
      messages: arrayRemove(obj),
    });
  };

  // open dialog
  const [open, setOpen] = React.useState(false);

  return (
    <MainContainer prop={message?.senderId === currentuser.id}>
      <MessageContainer
        ref={messageref}
        prop={message?.senderId === currentuser.id}
      >
        {cover}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          {message?.img && <img id="img" src={message?.img} />}
          <MessageContent
            img={message?.img}
            className={
              message?.senderId === currentuser.id ? "current" : "noCurrent"
            }
          >
            {message?.text}
          </MessageContent>
        </div>
        <MdRemove
          color="#ccc"
          onClick={() => setOpen(true)}
          style={{ cursor: "pointer" }}
        />
      </MessageContainer>
      <span style={{ color: "#ddd", marginTop: "10px" }} className="time">
        {currentTime > message?.date?.seconds + 70 ? sendDate : "Just Now"}
      </span>
      <AlertDialog
        open={open}
        setOpen={setOpen}
        function={() => DeleteMessage(message)}
        title={language?.language.Chat.chat.confirm}
        text={language?.language.Chat.chat.confirmText}
        language={language}
      />
    </MainContainer>
  );
};

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.prop ? "flex-end" : "start")};

  @media only screen and (max-width: 600px) {
    gap: 0vw;
  }

  & > span {
    font-size: 0.5vw;
    @media only screen and (max-width: 600px) {
      font-size: 2vw;
    }
  }
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  flex-direction: ${(props) => (props.prop ? "row-reverse" : "row")};
  justify-content: ${(props) => (props.prop ? "auto" : "start")};

  .current {
    background: #fff;
    border-radius: 20px 0 20px 20px;
  }
  .noCurrent {
    background: #fff;
    border-radius: 20px 20px 20px 0px;
  }

  #img {
    max-width: 25vw;
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
  padding: ${(props) => (props?.img ? "0" : "10px 20px")};
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
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
