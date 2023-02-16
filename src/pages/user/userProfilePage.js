import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import CoverSection from "../../pages/user/coverSection";
import { Links } from "../../pages/user/links";
import { Navigator } from "../../pages/user/navigator";
import { useSelector, useDispatch } from "react-redux";
import { setContentChanger } from "../../redux/user";
import { Contact } from "../../pages/user/contact";
import { db } from "../../firebase";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Spinner } from "../../components/loader";
import useWindowDimensions from "../../functions/dimensions";
import { IsMobile } from "../../functions/isMobile";
import { Outlet, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const UserProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const { Id } = useParams();

  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }
  const user = users?.find((item) => item.id === Id);

  // define mobile or desktop
  const isMobile = IsMobile();

  return (
    <Container>
      <CoverSection
        latitude={user?.adress.latitude}
        longitude={user?.adress.longitude}
        user={user}
      />
      <ContentSide>
        <div className="links">
          <Links user={user} />
        </div>
        <ContentRightSide>
          <Navigator type={user?.type} user={user} />
          {/* {loading ? (
            <LoadingContainer>
              <Spinner />
            </LoadingContainer>
          ) : ( */}
          <Outlet context={[user]} />
          {/* )} */}
        </ContentRightSide>
      </ContentSide>
    </Container>
  );
};

export default UserProfile;

const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.9vw;
  z-index: 5;
  overflow-x: hidden;
  overflow-y: scroll;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    padding-top: 14vw;
    box-sizing: border-box;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 0vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #222;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;

const ContentSide = styled.div`
  width: 70%;
  height: auto;
  height: 100%;
  display: flex;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    box-sizing: border-box;
  }

  .links {
    @media only screen and (max-width: 600px) {
      display: none;
    }
  }
`;

const ContentRightSide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 1px solid ${(props) => props.theme.lineColor};

  @media only screen and (max-width: 600px) {
    box-sizing: border-box;
  }
`;
