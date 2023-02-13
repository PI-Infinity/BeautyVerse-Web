import React, { useState, useContext } from "react";
import styled from "styled-components";
import CoverSection from "../../pages/user/coverSection";
import { Links } from "../../pages/user/links";
import { Navigator } from "../../pages/user/navigator";
// import { UserImages } from "../../pages/user/images";
// import { Services } from "../../pages/user/services";
// import { Products } from "../../pages/user/userProducts";
// import { AddProduct } from "../../pages/user/addProduct";
// import { Followers } from "../../pages/user/followers";
// import { Followings } from "../../pages/user/followings";
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

const UserProfile = () => {
  const dispatch = useDispatch();
  const { Id } = useParams();
  // const [loading, setLoading] = useState(true);

  console.log("user");

  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }
  const user = users?.find((item) => item.id === Id);

  // define mobile or desktop
  const isMobile = IsMobile();

  // setTimeout(() => {
  //   setLoading(false);
  // }, 500);

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
  min-height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.9vw;
  z-index: 5;
  overflow-x: hidden;
  overflow-y: scroll;

  @media only screen and (max-width: 600px) {
    padding-top: 14vw;
    box-sizing: border-box;
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
  border-left: 1px solid #e5e5e5;

  @media only screen and (max-width: 600px) {
    box-sizing: border-box;
  }
`;
