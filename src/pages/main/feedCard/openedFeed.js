import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import { IoMdArrowDropright, IoMdArrowDropleft } from "react-icons/io";
import { AddReview } from "../../../pages/main/feedCard/addReview";
import { ReviewList } from "../../../pages/main/feedCard/reviewList";
import {
  setDoc,
  getDocs,
  doc,
  collection,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
  getCountFromServer,
  orderBy,
  query,
} from "firebase/firestore";
import { v4 } from "uuid";
import { setOpenFeed } from "../../../redux/feed";
import { db } from "../../../firebase";
import useWindowDimensions from "../../../functions/dimensions";
import { IsMobile } from "../../../functions/isMobile";
import { AuthContext } from "../../../context/AuthContext";
import { Spinner } from "../../../components/loader";
import { isWebpSupported } from "react-image-webp/dist/utils";
import Avatar from "@mui/material/Avatar";
import GetTimesAgo from "../../../functions/getTimesAgo";
import { SiGoogletranslate } from "react-icons/si";
import { SlReload } from "react-icons/sl";
import { Language } from "../../../context/language";

export const OpenedFeed = (props) => {
  const { currentUser } = useContext(AuthContext);
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const language = Language();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const path = window.location.pathname;

  const [state, setState] = useState("");

  const rerender = useSelector((state) => state.storeMain.rerender);
  useEffect(() => {
    DefineState();
  }, [rerender, state?.userId, state?.imgNumber, path]);

  /**
   * define variables from link
   *  */
  const DefineState = async () => {
    // define user id
    let minused;
    if (path.startsWith("/user")) {
      minused = path.slice(6, path?.length);
    } else if (path.startsWith("/visit")) {
      minused = path.slice(12, path?.length);
    } else {
      minused = path.slice(1, path?.length);
    }
    const indexOfDash = await minused.indexOf("/");
    const id = await minused.slice(0, indexOfDash);

    // define user
    const docRef = doc(db, "users", `${id}`);
    const docSnap = await getDoc(docRef);

    let user;
    if (docSnap.exists()) {
      user = docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    //define img number
    let imgNumber;
    if (path[path?.length - 2] === "/") {
      imgNumber = path[path?.length - 1];
    } else if (path[path?.length - 3] === "/") {
      imgNumber = path.slice(path?.length - 2, path?.length);
    } else if (path[path?.length - 4] === "/") {
      imgNumber = path.slice(path?.length - 3, path?.length);
    } else if (path[path?.length - 5] === "/") {
      imgNumber = path.slice(path?.length - 4, path?.length);
    } else if (path[path?.length - 6] === "/") {
      imgNumber = path.slice(path?.length - 5, path?.length);
    }
    setState({
      userId: id,
      userCover: user?.cover,
      userName: user?.name,
      userType: user?.type,
      imgNumber: parseInt(imgNumber),
    });
  };

  /*
  /import current user & parse it
  */

  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  const [feed, setFeed] = useState([]);

  const [reviews, setReviews] = useState([]);

  // add review to firebase
  const [reviewText, setReviewText] = React.useState("");

  const fnc = async (num) => {
    setLoading(true);
    const coll = collection(db, "users", `${state?.userId}`, "feeds");
    //get coll length
    const snapshot = await getCountFromServer(coll);
    const feedsLength = snapshot.data().count;
    //get current query
    const data = query(coll, orderBy("addTime", "desc"));
    const documentSnapshots = await getDocs(data);
    const feedDoc = documentSnapshots.docs[num];
    const currentFeed = feedDoc?.data();

    // get next page
    const prevDoc = documentSnapshots.docs[num !== 0 ? num - 1 : 0];
    const prevFeedId = prevDoc?.data().id;
    // get prev page
    const nextDoc =
      documentSnapshots.docs[num + 1 > feedsLength - 1 ? num : num + 1];
    const nextFeedId = nextDoc?.data().id;

    // get review sorderBy("name", "desc"),
    const revRef = query(
      collection(
        db,
        "users",
        `${state?.userId}`,
        "feeds",
        `${currentFeed?.id}`,
        "reviews"
      ),
      orderBy("time", "desc")
    );
    await onSnapshot(revRef, (snapshot) => {
      setReviews(snapshot.docs.map((doc) => doc.data()));
    });

    setFeed({
      feedsLength: feedsLength,
      currentFeed: currentFeed,
      nextFeedId: nextFeedId,
      prevFeedId: prevFeedId,
    });

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  // define post img added time
  const [postTime, setPostTime] = React.useState([]);

  // open report
  const [reports, setReports] = React.useState(false);

  React.useEffect(() => {
    fnc(state?.imgNumber);
  }, [rerender, state?.userId, state?.imgNumber, path]);

  // define shown post added time
  const currentPostTime = GetTimesAgo(feed?.currentFeed?.addTime?.seconds);
  let timeTitle;
  if (currentPostTime?.title === "h") {
    timeTitle = language?.language.Main.feedCard.h;
  } else if (currentPostTime?.title === "min") {
    timeTitle = language?.language.Main.feedCard.min;
  } else {
    timeTitle = currentPostTime?.title;
  }
  /**
   * define links destionation path
   */

  //define next link
  const GoToNext = () => {
    let navigatePath;
    if (path.startsWith("/user")) {
      navigatePath = () =>
        navigate(
          `/user/${state?.userId}/feed/${feed?.nextFeedId}/${
            state?.imgNumber + 1
          }`
        );
    } else if (path.startsWith("/visit")) {
      navigatePath = () =>
        navigate(
          `/visit/user/${state?.userId}/feed/${feed?.nextFeedId}/${
            state?.imgNumber + 1
          }`
        );
    } else {
      navigatePath = () =>
        navigate(
          `/${state?.userId}/feed/${feed?.nextFeedId}/${state?.imgNumber + 1}`
        );
    }
    return navigatePath;
  };

  const nextLink = GoToNext();

  // define prev link
  const GoToPrev = () => {
    let navigatePath;
    if (path.startsWith("/user")) {
      navigatePath = () =>
        navigate(
          `/user/${state?.userId}/feed/${feed?.prevFeedId}/${
            state?.imgNumber - 1
          }`
        );
    } else if (path.startsWith("/visit")) {
      navigatePath = () =>
        navigate(
          `/visit/user/${state?.userId}/feed/${feed?.prevFeedId}/${
            state?.imgNumber - 1
          }`
        );
    } else {
      navigatePath = () =>
        navigate(
          `/${state?.userId}/feed/${feed?.prevFeedId}/${state?.imgNumber - 1}`
        );
    }
    return navigatePath;
  };

  const prevLink = GoToPrev();

  //define closing link
  const Closing = () => {
    let navigatePath;
    if (path.startsWith("/user")) {
      navigatePath = () => navigate(`/user/${state.userId}`);
    } else {
      navigatePath = () => navigate("/");
    }
    return navigatePath;
  };

  const closeOpenedFeed = Closing();

  // translate feed
  const [translated, setTranslated] = React.useState("");

  const lang = useSelector((state) => state.storeMain.language);

  // translate feed text
  const GetLanguages = (x) => {
    const API_KEY = "AIzaSyAuSnUmGlptL0E4m4wP-1XzlqL_iv_y3g8";

    let url = `https://translation.googleapis.com/language/translate/v2?q=${x}&target=${lang}&key=${API_KEY}`;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response.data.translations[0].translatedText);
        setTranslated(response.data.translations[0].translatedText);
      })
      .catch((error) => {
        console.log("There was an error with the translation request: ", error);
      });
  };

  return (
    <Container height={height}>
      <Wrapper height={height} id="wrapper">
        {loading && (
          <LoaderContainer loading={loading.toString()}>
            <Spinner />
          </LoaderContainer>
        )}
        <ImgContainer>
          {state?.imgNumber > 0 && (
            <Arrow right="true" onClick={prevLink}>
              <IoMdArrowDropleft size={40} color="rgba(255,255,255,0.5)" />
            </Arrow>
          )}
          {feed?.currentFeed?.name?.toLowerCase().endsWith("mp4") ? (
            <Video width="100%" height="auto" controls autoplay muted>
              <source src={feed?.currentFeed?.videoUrl} type="video/mp4" />
            </Video>
          ) : (
            <>
              {isMobile ? (
                isWebpSupported() ? (
                  <MainImg
                    src={feed?.currentFeed?.mobileWEBPurl}
                    active={props.active}
                  />
                ) : (
                  <MainImg
                    src={feed?.currentFeed?.mobileJPEGurl}
                    active={props.active}
                  />
                )
              ) : (
                <MainImg
                  src={feed?.currentFeed?.desktopJPEGurl}
                  active={props.active}
                />
              )}
            </>
          )}
          {state?.imgNumber < feed?.feedsLength - 1 && (
            <Arrow left="true" onClick={nextLink}>
              <IoMdArrowDropright size={40} color="rgba(255,255,255,0.5)" />
            </Arrow>
          )}
        </ImgContainer>

        <PostSide loading={loading.toString()}>
          <UserInfo>
            <Avatar
              onClick={() => navigate(`/user/${state?.userId}`)}
              alt={state?.userName}
              src={state?.userCover !== undefined ? state?.userCover : ""}
              sx={{ width: 42, height: 42, cursor: "pointer" }}
            />

            <UserName onClick={() => navigate(`/user/${state?.userId}`)}>
              {state?.userName}
            </UserName>
            {currentPostTime !== undefined && (
              <PostTime>
                {currentPostTime === "Just now"
                  ? language?.language.Main.feedCard.justNow
                  : currentPostTime?.numbers + " " + timeTitle}
              </PostTime>
            )}

            <ClosePost onClick={closeOpenedFeed}>
              <MdOutlineCloseFullscreen className="closeIcon" />
            </ClosePost>
          </UserInfo>
          <Post>
            {translated?.length > 0 ? translated : feed?.currentFeed?.post}
            <div style={{ cursor: "pointer" }}>
              {translated?.length < 1 ? (
                <SiGoogletranslate
                  onClick={() => GetLanguages(feed?.currentFeed?.post)}
                  size={14}
                  color="#ddd"
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <SlReload
                  onClick={() => setTranslated("")}
                  size={14}
                  color="#ddd"
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          </Post>
          <ReviewList
            reviews={reviews}
            currentuser={currentuser}
            setReviewText={setReviewText}
            id={state?.userId}
            currentFeed={feed?.currentFeed}
          />

          <>
            {!isMobile && (
              <AddReview
                opened={true}
                reviews={reviews}
                currentuser={currentuser}
                name={state?.userName}
                id={state?.userId}
                cover={state?.userCover}
                reviews={reviews}
                currentFeed={feed?.currentFeed}
                setOpenFeed={setOpenFeed}
                setReviewText={setReviewText}
                reviewText={reviewText}
                pathc={path}
                state={state}
              />
            )}
          </>
        </PostSide>
      </Wrapper>
      {isMobile && (
        <AddReview
          opened={true}
          reviews={reviews}
          currentuser={currentuser}
          name={state?.userName}
          id={state?.userId}
          cover={state?.userCover}
          reviews={reviews}
          currentFeed={feed?.currentFeed}
          setOpenFeed={setOpenFeed}
          setReviewText={setReviewText}
          reviewText={reviewText}
          pathc={path}
          state={state}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2.5vw;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(40px);
  z-index: 10001;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    padding: 0;
    height: auto;
    min-height: ${(props) => props.height}px;
    background: ${(props) => props.theme.background};
    backdrop-filter: blur(40px);
  }
`;

const Wrapper = styled.div`
  background: ${(props) => props.theme.background};
  backdrop-filter: blur(40px);
  width: 80%;
  // padding: 0.5vw;
  height: 100%;
  min-height: 100%;
  display: flex;
  box-sizing: border-box;
  border-radius: 0.5vw;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    width: 100vw;
    height: ${(props) => props.height}px;
    min-height: 0%;
    overflow-y: scroll;
    overflow-x: hidden;
    background: none;
  }
`;

const LoaderContainer = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.background};
  position: absolute;
  z-index: 10005;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: 100vh;
    align-items: center;
    padding-bottom: 10vh;
    box-sizing: border-box;
  }
`;

const ImgContainer = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050505;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: auto;
    align-items: ${(props) => (props.loading === "true" ? "center" : "start")};
    position: relative;
    background: #050505;
    min-height: ${(props) => (props.loading === "true" ? "80vh" : "auto")};
    // border-bottom: 1px solid #f3f3f3;
  }
`;

const MainImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  // transition: opacity 1s;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: auto;
    max-width: 100%;
    max-height: auto;
  }
`;
const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  // transition: opacity 1s;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: auto;
    max-width: 100%;
    max-height: auto;
  }
`;

const PostSide = styled.div`
  width: 50%;
  height: 100%;
  padding: 0 3vw;
  box-sizing: border-box;
  background: none;
  border-radius: 0.25vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: ${(props) => (props.loading === "true" ? "100%" : "auto")};
    align-items: center;
    padding: 0 5vw;
  }
`;

const UserInfo = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 2vw 0 0 0;

  @media only screen and (max-width: 600px) {
    margin: 4vw 0 0 0;
    width: 90vw;
    padding: 0;
  }
`;

const CoverContainer = styled.div`
  width: 3vw;
  height: 3vw;
  border-radius: 50vw;
  overflow: hidden;
  object-fit: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 9vw;
    height: 9vw;
    border: 1px solid #f3f3f3;
  }
`;

const CoverImg = styled.img`
  width: 3vw;
  height: 3vw;

  @media only screen and (max-width: 600px) {
    width: 9vw;
    height: 9vw;
  }
`;

const UserName = styled.h3`
  width: 40%;
  font-size: 1vw;
  margin: 0;
  cursor: pointer;
  color: ${(props) => props.theme.font};

  :hover {
    text-decoration: underline;
  }

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
  }
`;

const PostTime = styled.div`
  width: 5vw;
  color: #ccc;
  font-size: 12px;

  @media only screen and (max-width: 600px) {
    width: 30vw;
  }
`;

const ClosePost = styled.div`
  padding: 0.25vw;
  margin-left: auto;
  cursor: pointer;

  .closeIcon {
    font-size: 1.2vw;
    position: relative;
    bottom: 1vw;
    left: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  @media only screen and (max-width: 600px) {
    position: absolute;
    top: 5vw;
    right: 5vw;
  }
`;

const UserProfileEmpty = styled.div`
  width: 3vw;
  height: 3vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  // background: red;

  @media only screen and (max-width: 600px) {
    width: 6vw;
    height: 6vw;
  }

  .user {
    font-size: 1.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;

const Post = styled.div`
  display: flex;
  text-alignt: start;
  justify-content: space-between;
  width: 100%;
  height: auto;
  max-height: 30%;
  overflow-y: scroll;
  padding: 30px 20px;
  box-sizing: border-box;
  font-size: 14px;
  color: ${(props) => props.theme.font};

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

  @media only screen and (max-width: 600px) {
    height: auto;
    max-height: 100%;
    overflow: hidden;
    padding: 6vw 5px;
  }
`;

const Arrow = styled.div`
  position: absolute;
  margin-right: ${(props) => (props.right === "true" ? "43%" : "auto")};
  margin-left: ${(props) => (props.left === "true" ? "43%" : "auto")};
  // opacity: ${(props) => (props.off ? "0" : "0.2")};
  width: 2.5vw;
  height: 2.5vw;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  cursor: ${(props) => (props.off ? "auto" : "pointer")};
  transition: ease-in-out 150ms;
  color: #444;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  z-index: 1005;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(40px);

  @media only screen and (max-width: 600px) {
    position: absolute;
    width: 9vw;
    height: 9vw;
    font-size: 9vw;
    margin-top: 0;
    margin-right: 0;
    margin-left: 0;
    top: calc(50% - 4.5vw);
    left: ${(props) => (props.right === "true" ? "5vw" : "auto")};
    right: ${(props) => (props.left === "true" ? "5vw" : "auto")};
  }

  :hover {
    opacity: ${(props) => (props.off ? "0" : "0.8")};
  }
`;
