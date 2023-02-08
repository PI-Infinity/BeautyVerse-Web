import React, { useState, useContext } from "react";
import styled from "styled-components";
import { CoverSection } from "../../pages/user/coverSection";
import { Links } from "../../pages/user/links";
import { Navigator } from "../../pages/user/navigator";
import { UserImages } from "../../pages/user/images";
import { Services } from "../../pages/user/services";
import { Products } from "../../pages/user/userProducts";
import { AddProduct } from "../../pages/user/addProduct";
import { Followers } from "../../pages/user/followers";
import { Followings } from "../../pages/user/followings";
import { useSelector, useDispatch } from "react-redux";
import { setContentChanger } from "../../redux/user";
import { Info } from "../../pages/user/info";
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

const UserProfile = () => {
  const dispatch = useDispatch();
  const userUnparsed = useSelector((state) => state.storeMain.user);
  const [loading, setLoading] = useState(true);

  // define content
  const contentChanger = useSelector((state) => state.storeUser.contentChanger);

  React.useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [contentChanger]);

  // open add product window
  const [add, setAdd] = useState(false);

  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

  // import user gallery images from firestore
  const [feeds, setFeeds] = useState("");

  React.useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${user.id}`, "feeds"),
      (snapshot) => {
        setFeeds(snapshot.docs.map((doc) => doc.data()));
      }
    );
    return data;
  }, [contentChanger]);

  // define mobile or desktop
  const isMobile = useWindowDimensions();

  React.useEffect(() => {
    if (user?.type == "user") {
      if (isMobile) {
        dispatch(setContentChanger("contact"));
      } else {
        dispatch(setContentChanger("followings"));
      }
    } else if (user?.type == "shop") {
      dispatch(setContentChanger("products"));
    } else {
      dispatch(setContentChanger("posts"));
    }
  }, []);

  let content;
  if (contentChanger == "posts") {
    content = <UserImages feeds={feeds} />;
  } else if (contentChanger == "services") {
    content = <Services />;
  } else if (contentChanger == "products") {
    content = add ? (
      <AddProduct setAdd={setAdd} />
    ) : (
      <Products setAdd={setAdd} />
    );
  } else if (contentChanger == "followers") {
    content = <Followers />;
  } else if (contentChanger == "contact") {
    content = <Info userVisit={false} />;
  } else {
    content = <Followings />;
  }

  setTimeout(() => {
    setLoading(false);
  }, 500);

  return (
    <Container>
      <CoverSection
        latitude={user?.adress.latitude}
        longitude={user?.adress.longitude}
      />
      <ContentSide>
        <div className="links">
          <Links user={user} />
        </div>
        <ContentRightSide>
          <Navigator type={user?.type} />
          {loading ? (
            <LoadingContainer>
              <Spinner />
            </LoadingContainer>
          ) : (
            <>{content}</>
          )}
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
