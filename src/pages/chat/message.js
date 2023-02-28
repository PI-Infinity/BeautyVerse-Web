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
import ChatMsg from "@mui-treasury/components/chatMsg/ChatMsg";
import GetTimesAgo from "../../functions/getTimesAgo";

export const Message = ({ message, sameSender, prevMsg, nextMsg }) => {
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

  // define send time
  const time = GetTimesAgo(message?.date.seconds);
  let timeTitle;
  if (time?.title === "h") {
    timeTitle = language?.language.Main.feedCard.h;
  } else if (time?.title === "min") {
    timeTitle = language?.language.Main.feedCard.min;
  }

  let cover;
  if (!sameSender) {
    if (message?.senderId === currentuser?.id) {
      cover = (
        <Avatar
          alt={currentuser?.name}
          src={currentuser?.cover}
          sx={{ width: 30, height: 30 }}
        />
      );
    } else {
      let us = userList?.find((item) => item?.id === message?.senderId);
      cover = (
        <Avatar alt={us?.name} src={us?.cover} sx={{ width: 30, height: 30 }} />
      );
    }
  } else {
    cover = <div style={{ width: 30, height: 30 }} />;
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

  // define message design
  let design;
  if (message?.senderId === currentuser.id) {
    if (
      prevMsg?.senderId === nextMsg?.senderId &&
      prevMsg?.senderId === message?.senderId
    ) {
      design = "50px 8px 8px 50px";
    } else if (
      prevMsg?.senderId !== message?.senderId &&
      message?.senderId === nextMsg?.senderId
    ) {
      design = "50px 40px 8px 50px";
    } else if (
      prevMsg?.senderId === message?.senderId &&
      message?.senderId !== nextMsg?.senderId
    ) {
      design = "50px 8px 40px 50px";
    } else {
      design = "50px 50px 50px 50px";
    }
  } else {
    if (
      prevMsg?.senderId === nextMsg?.senderId &&
      prevMsg?.senderId === message?.senderId
    ) {
      design = "8px 50px 50px 8px";
    } else if (
      prevMsg?.senderId !== message?.senderId &&
      message?.senderId === nextMsg?.senderId
    ) {
      design = "40px 50px 50px 8px";
    } else if (
      prevMsg?.senderId === message?.senderId &&
      message?.senderId !== nextMsg?.senderId
    ) {
      design = "8px 50px 50px 40px";
    } else {
      design = "50px 50px 50px 50px";
    }
  }

  // define
  let lastMsg;
  if (
    (prevMsg?.senderId === message?.senderId ||
      prevMsg?.senderId === undefined ||
      prevMsg?.senderId !== message?.senderId) &&
    (nextMsg?.senderId !== message?.senderId || nextMsg?.senderId === undefined)
  ) {
    lastMsg = true;
  }

  return (
    <MainContainer prop={message?.senderId === currentuser.id}>
      <MessageContainer
        ref={messageref}
        prop={message?.senderId === currentuser.id}
        design={design}
      >
        {message?.senderId !== currentuser.id && cover}
        <div>
          {message?.img && (
            <img id="img" style={{ margin: "2px 0" }} src={message?.img} />
          )}
          <MessageContent
            img={message?.img}
            className={
              message?.senderId === currentuser.id ? "current" : "noCurrent"
            }
            onClick={() => setOpen(true)}
          >
            {message?.text}
          </MessageContent>
        </div>
        {lastMsg && (
          <span
            style={{
              color: "#ddd",
              opacity: "0.7",
              marginTop: "5px",
            }}
            className="time"
          >
            {time === "Just now"
              ? language?.language.Main.feedCard.justNow
              : time?.numbers + " " + timeTitle}
          </span>
        )}
        {/* <MdRemove
          color="#ccc"
          onClick={() => setOpen(true)}
          style={{ cursor: "pointer" }}
        /> */}
        {/* {prevMsg?.id === message?.id && ( */}
        {/* )} */}
      </MessageContainer>

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
  // width: 100%;
  // display: flex;
  // // flex-direction: column;
  // // align-items: ${(props) => (props.prop ? "flex-end" : "start")};

  // @media only screen and (max-width: 600px) {
  // }
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  flex-direction: ${(props) => (props.prop ? "row-reverse" : "row")};
  justify-content: ${(props) => (props.prop ? "auto" : "start")};

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
    font-size: 0.5vw;
    @media only screen and (max-width: 600px) {
      font-size: 1.5vw;
    }
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
  padding: ${(props) => (props?.img ? "0" : "5px 14px 6px 14px")};
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  font-size: 15px;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    padding: ${(props) => (props?.img ? "0" : "7px 15px 8px 15px")};
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
