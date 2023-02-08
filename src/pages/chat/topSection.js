import React, { useContext, useState, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext";
import styled from "styled-components";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ImList2 } from "react-icons/im";
import { FaUser } from "react-icons/fa";

export const TopSection = (props) => {
  const navigate = useNavigate();
  const { data } = useContext(ChatContext);

  const chatUser = useSelector((state) => state.storeChat.currentChat);
  console.log(chatUser);
  return (
    <Container>
      {chatUser[0]?.cover?.length > 0 ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Img
              src={chatUser[0]?.cover}
              alt=""
              onClick={() => navigate(`/user/${chatUser[0]?.userId}`)}
            />
            <h4 onClick={() => navigate(`/user/${chatUser[0]?.userId}`)}>
              {chatUser[0]?.name}
            </h4>
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <UserProfileEmpty>
            <FaUser className="user" />
          </UserProfileEmpty>
          <h4 onClick={() => navigate(`/user/${chatUser[0]?.userId}`)}>
            {chatUser[0]?.name}
          </h4>
        </div>
      )}
      <ImList2 id="closeIcon" onClick={() => navigate("/chat")} />
    </Container>
  );
};

const Container = styled.div`
  padding: 30px 20px;
  height: 30px;
  width: 100%;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  background: #fff;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    height: 15vw;
    min-height: 15vw;
    box-sizing: border-box;
    padding: 2vw 4vw 2vw 3vw;
    z-index: 1000;
    width: 100vw;
    margin: 0;
  }

  h4 {
    cursor: pointer;
    :hover {
      text-decoration: underline;
    }
  }

  #closeIcon {
    display: flex;
    font-size: 1.2vw;
    @media only screen and (max-width: 600px) {
      font-size: 4vw;
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
