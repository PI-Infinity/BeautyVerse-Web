import React, { useEffect, useContext, useState } from "react";
import styled from "styled-components";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import {
  setUser,
  setCover,
  setGallery,
  setUserList,
  setCoverInfo,
} from "../redux/main";
import { MdCircleNotifications, MdPersonPin } from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";
import { BsStars, BsLayoutTextSidebarReverse } from "react-icons/bs";
import { setLoading, setRerender } from "../redux/main";

export const Loading = (props) => {
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <Container
      style={{
        widht: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <BsStars className="logo" />
      <Title>Beauty</Title>
      <Title2 style={{ fontWeight: "normal" }}>verse</Title2>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.background};
  .logo {
    font-size: 2.7vw;
    color: ${(props) => props.theme.logo};
    @media only screen and (max-width: 600px) {
      font-size: 7vw;
      position: relative;
      bottom: 3vw;
      margin-right: 1vw;
    }
  }
`;

const Title = styled.h2`
  font-size: 1.7vw;
  color: ${(props) => props.theme.logo};
  @media only screen and (max-width: 600px) {
    font-size: 7vw;
    position: relative;
    bottom: 3vw;
  }
`;
const Title2 = styled.h2`
  font-size: 1.7vw;
  color: ${(props) => props.theme.logo2};
  @media only screen and (max-width: 600px) {
    font-size: 7vw;
    position: relative;
    bottom: 3vw;
  }
`;
