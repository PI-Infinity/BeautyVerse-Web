import React, { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import styled from "styled-components";
import { useSelector } from "react-redux";
import {
  ref,
  uploadBytesResumable,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import { storage, db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";

export const Message = ({ message }) => {
  const navigate = useNavigate();

  const { currentUser } = useContext(AuthContext);
  const unparsedUser = useSelector((state) => state.storeMain.user);

  let currentuser;
  if (unparsedUser?.length > 0) {
    currentuser = JSON.parse(unparsedUser);
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

  // define user cover
  const DefineCurrentUserCover = () => {
    let currentUserCover;
    if (currentuser?.cover !== undefined) {
      currentUserCover = currentuser?.cover;
    } else
      currentUserCover = (
        <UserProfileEmpty>
          <FaUser className="user" />
        </UserProfileEmpty>
      );
    return currentUserCover;
  };
  const DefineUserCover = () => {
    let userCover;
    if (user?.cover !== undefined) {
      userCover = user?.cover;
    } else
      userCover = (
        <UserProfileEmpty>
          <FaUser className="user" />
        </UserProfileEmpty>
      );

    return userCover;
  };

  const currentUserCover = DefineCurrentUserCover();
  const userCover = DefineUserCover();

  let coverImg;
  if (
    message?.senderId === currentuser.id &&
    currentuser?.cover !== undefined
  ) {
    coverImg = (
      <Img
        src={currentuser?.cover}
        onClick={
          message?.senderId === currentuser.id
            ? () => navigate("/user")
            : () => navigate(`/user/${message?.senderId}`)
        }
      />
    );
  } else if (
    message?.senderId === currentuser.id &&
    currentuser?.cover === undefined
  ) {
    coverImg = (
      <UserProfileEmpty
        onClick={
          message?.senderId === currentuser.id
            ? () => navigate("/user")
            : () => navigate(`/user/${message?.senderId}`)
        }
      >
        <FaUser className="user" />
      </UserProfileEmpty>
    );
  } else if (
    message?.senderId !== currentuser.id &&
    user?.cover !== undefined
  ) {
    coverImg = (
      <Img
        src={user?.cover}
        onClick={
          message?.senderId === currentuser.id
            ? () => navigate("/user")
            : () => navigate(`/user/${message?.senderId}`)
        }
      />
    );
  } else {
    coverImg = (
      <UserProfileEmpty
        onClick={
          message?.senderId === currentuser.id
            ? () => navigate("/user")
            : () => navigate(`/user/${message?.senderId}`)
        }
      >
        <FaUser className="user" />
      </UserProfileEmpty>
    );
  }

  return (
    <MainContainer prop={message?.senderId === currentuser.id}>
      <MessageContainer
        ref={messageref}
        prop={message?.senderId === currentuser.id}
      >
        {coverImg}
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
      </MessageContainer>
      <span style={{ color: "#ddd" }}>
        {currentTime > message?.date?.seconds + 70 ? sendDate : "Just Now"}
      </span>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.prop ? "flex-end" : "start")};

  @media only screen and (max-width: 600px) {
    gap: 2vw;
  }

  & > span {
    font-size: 0.8vw;
    @media only screen and (max-width: 600px) {
      font-size: 2.7vw;
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
    width: 50vw;
    @media only screen and (max-width: 600px) {
      width: 35vw;
      // height: 30vw;
      object-fit: cover;
      border-radius: 2vw;
    }
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
