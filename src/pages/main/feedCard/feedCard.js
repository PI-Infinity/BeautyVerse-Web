import React, { useContext } from "react";
import styled from "styled-components";
import { BiStar } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  setDoc,
  doc,
  collection,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  deleteField,
  getDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  getCountFromServer,
  limit,
} from "firebase/firestore";
import {
  setImgNumber,
  setFeeds,
  setReviews,
  setStars,
  setUserId,
  setUserCover,
  setUserName,
  setOpenFeed,
  setUserType,
  setFromReviews,
} from "../../../redux/feed";
import { setLoadFeed } from "../../../redux/main";
import { TopSection } from "../../../pages/main/feedCard/topSection";
import { Reports } from "../../../pages/main/feedCard/reports";
import { storage, db } from "../../../firebase";
import { FaUser } from "react-icons/fa";
import { RiArrowLeftSFill, RiArrowRightSFill } from "react-icons/ri";
import { FaLongArrowAltDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { OpenedFeed } from "../../../pages/main/feedCard/openedFeed";
import useWindowDimensions from "../../../functions/dimensions";
import { ImgLoader, TextLoader, LineLoader } from "../../../components/loader";

// const LazyImage = ({ src, alt, width, height }) => {
//   const [imageLoaded, setImageLoaded] = useState(false);

//   useEffect(() => {
//     const img = new Image();
//     img.src = src;
//     img.onload = () => {
//       setImageLoaded(true);
//     };
//   }, [src]);

//   return (
//     <LazyLoad once={true} height={height}>
//       {imageLoaded ? (
//         <img src={src} alt={alt} width={width} height={height} />
//       ) : (
//         <div style={{ width, height }} />
//       )}
//     </LazyLoad>
//   );
// };

// export default LazyImage;

export const FeedCard = (props) => {
  const { currentUser } = useContext(AuthContext);
  const { height, width } = useWindowDimensions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // loading feeds
  const [loading, setLoading] = React.useState(true);

  const loadFeed = useSelector((state) => state.storeMain.loadFeed);
  const openFeed = useSelector((state) => state.storeFeed.openFeed);

  const rerender = useSelector((state) => state.storeMain.rerender);

  const cityFilter = useSelector((state) => state.storeFilter.cityFilter);
  const destrictFilter = useSelector(
    (state) => state.storeFilter.destrictFilter
  );

  // capitalize first letters

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // reviews
  const [openReview, setOpenReview] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setOpenReview(false);
  }, [rerender, props?.id]);

  /** user gallery slider in feed */

  // define imgs with url and name from cloude storage
  const [feed, setFeed] = React.useState([]);
  const [stars, setStars] = React.useState([]);

  //get user feeds from storage
  const fnc = async () => {
    // define feeds collection
    const feedsRef = collection(db, "users", `${props?.id}`, "feeds");
    // get last post
    const feedRef = query(feedsRef, orderBy("addTime", "desc"), limit(1));
    const querySnapshot = await getDocs(feedRef);
    const feed = querySnapshot?.docs[0]?.data();
    // get reviews length
    const reviewsRef = collection(
      db,
      "users",
      `${props?.id}`,
      "feeds",
      `${feed?.id}`,
      "reviews"
    );
    const reviewsLengthRef = await getCountFromServer(reviewsRef);
    const reviewsLength = reviewsLengthRef.data().count;

    // get stars
    onSnapshot(
      collection(db, "users", `${props?.id}`, "feeds", `${feed?.id}`, "stars"),
      (snapshot) => {
        setStars(snapshot.docs.map((doc) => doc.data()));
      }
    );

    // define feed object
    setFeed({
      feed: feed,
      reviewsLength: reviewsLength,
      userName: capitalizeFirstLetter(props?.name),
      userType: capitalizeFirstLetter(props?.type),
      puserCover: props?.cover,
    });
  };

  React.useEffect(() => {
    fnc();
  }, [rerender, props?.id, currentUser]);

  // give heart to user
  const SetStar = async () => {
    await setDoc(
      doc(
        db,
        `users`,
        `${props.id}`,
        "feeds",
        `${feed?.feed?.id}`,
        "stars",
        currentUser?.uid
      ),
      {
        id: currentUser?.uid,
        name: feed?.userName,
        cover: props?.cover ? props?.cover : "",
      }
    );
  };

  // define star already given to user or not
  const isStarGiven = stars?.find((item) => item.id === currentUser?.uid);

  // remove heart
  const RemoveStar = async () => {
    await deleteDoc(
      doc(
        db,
        `users`,
        `${props.id}`,
        "feeds",
        `${feed?.feed?.id}`,
        "stars",
        currentUser?.uid
      )
    );
  };

  // define post img added time
  const [postTime, setPostTime] = React.useState([]);

  // open report
  const [reports, setReports] = React.useState(false);

  // define shown post added time
  const currentPostTime = new Date(feed?.feed?.addTime?.seconds * 1000)
    .toString()
    .slice(4, 15);

  /** Define following to user or not
   * //
   */

  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }
  // import followings
  const followings = useSelector((state) => state.storeMain.followings);

  // define if props user is in your followings list
  const following = followings.find((item) => item.id == props.id);

  const userToFollow = props;

  // function to follow user
  const FollowToUser = async () => {
    await setDoc(
      doc(db, `users`, `${currentUser?.uid}`, "followings", `${props?.id}`),
      {
        ...props,
      }
    );
    await setDoc(
      doc(db, `users`, `${props?.id}`, "followers", `${currentUser?.uid}`),
      {
        ...currentuser,
      }
    );
    // handleSelect();
  };

  // function to unfollow user
  const UnFollowToUser = async () => {
    const coll = collection(db, `users`, `${currentUser?.uid}`, "followings");

    deleteDoc(doc(coll, `${props?.id}`));
  };

  // open post
  const [openPost, setOpenPost] = React.useState(false);

  setTimeout(() => {
    setLoading(false);
  }, 600);

  return (
    <Main feed={feed?.feed?.url}>
      {/* {loading ? (
        <Loader />
      ) : ( */}
      <Container>
        <Divider id="divider" loading={loading.toString()}></Divider>
        <TopSection
          cover={props.cover}
          following={following}
          id={props.id}
          name={feed?.userName}
          userType={feed?.userType}
          UnFollowToUser={UnFollowToUser}
          FollowToUser={FollowToUser}
          reports={reports}
          setReports={setReports}
          loading={loading}
        />
        {feed?.feed?.post?.length > 0 && (
          <PostContainer openPost={openPost}>
            <p
              style={{
                whiteSpace: "pre-line",
                margin: "0 5px 5px 5px",
                fontSize: "14px",
              }}
            >
              {loading ? <TextLoader /> : <>{feed?.feed?.post}</>}
            </p>
          </PostContainer>
        )}
        <div
          style={{
            width: "100%",
            height: "100%",
            minHeight: "300px",
            display: "flex",
            alingItems: "center",
            justifyContent: "center",
          }}
          onClick={() => navigate(`${props?.id}/feed/${feed?.feed?.id}/0`)}
        >
          {loading ? (
            <ImgLoader />
          ) : (
            <div>
              {reports && <Reports />}
              {feed?.feed?.url?.length > 0 && (
                <>
                  {feed?.feed?.name?.endsWith("mp4") ? (
                    <Video width="100%" height="auto" controls autoplay muted>
                      <source src={feed?.feed?.url} type="video/mp4" />
                    </Video>
                  ) : (
                    <Cover src={feed?.feed?.url} />
                  )}
                </>
              )}
            </div>
          )}
        </div>
        {/* )} */}

        <Review>
          {loading ? (
            <LineLoader />
          ) : (
            <>
              <div style={{ flex: 1 }}>
                <Likes>
                  {isStarGiven != undefined ? (
                    <BiStar className="likedIcon" onClick={RemoveStar} />
                  ) : (
                    <BiStar
                      className="unlikedIcon"
                      onClick={
                        currentUser != undefined
                          ? SetStar
                          : () => navigate("/login")
                      }
                    />
                  )}
                  {stars?.length}
                </Likes>
              </div>

              <div
                style={{ flex: 1, display: "flex", justifyContent: "center" }}
              >
                <Link
                  style={{ color: "inherit", textDecoration: "none" }}
                  to={`${props?.id}/feed/${feed?.feed?.id}/0`}
                >
                  <TextReview
                    open={openReview}
                    onClick={() =>
                      navigate(`${props?.id}/feed/${feed?.feed?.id}/0`)
                    }
                  >
                    ({feed?.reviewsLength}) შეფასებები
                  </TextReview>
                </Link>
              </div>
              <PostTime>
                <span>{currentPostTime}</span>
              </PostTime>
            </>
          )}
        </Review>
      </Container>
      {/* )} */}
    </Main>
  );
};

const Main = styled.div`
  display: ${(props) => (props.feed === undefined ? "none" : "auto")};
`;

const Divider = styled.div`
  display: none;
  @media only screen and (max-width: 600px) {
    display: flex;
    height: 1.5vw;
    background: ${(props) => (props.loading === "true" ? "#f3f3f3" : "#ccc")};
    width: 100%;
  }
`;

const Container = styled.div`
  width: 35vw;
  height: auto;
  max-height: auto;
  max-width: 35vw;
  border-radius: 0.5vw;
  display: flex;
  flex-direction: column;
  justify-content: start;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  background: rgba(0, 0, 0, 0.9);
  transition: ease 250ms;
  margin-bottom: 1vw;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: auto;
    max-height: auto;
    max-width: 100vw;
    border-radius: 0;
    box-sizing: border-box;
    margin-bottom: 0;
    background: #f7e6ff;
  }
`;

const PostContainer = styled.div`
  padding: 0 20px 10px 20px;
  margin: 0;
  max-height: ${(props) => (props.openPost ? "100%" : "55px")};
  height: auto,
  overflow: ${(props) => (props.openPost ? "visible" : "hidden")};
  cursor: pointer;
  background: ${(props) => props.theme.background};

  & > p {
    background: ${(props) => props.theme.background};
  }
`;

const Cover = styled.img`
  max-width: 100%;
  max-height: 35vw;
  display: block;
  margin-left: auto;
  margin-right: auto;
  object-fit: cover;
  cursor: pointer;
  animation: fadeIn ease 0.3s;
  -webkit-animation: fadeIn ease 0.3s;
  -moz-animation: fadeIn ease 0.3s;
  -o-animation: fadeIn ease 0.3s;
  -ms-animation: fadeIn ease 0.3s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 600px) {
    max-width: 100%;
    max-height: 100%;
  }
`;

const Video = styled.video`
  max-width: 100%;
  max-height: 35vw;
  display: block;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn ease 0.5s;
  -webkit-animation: fadeIn ease 0.5s;
  -moz-animation: fadeIn ease 0.5s;
  -o-animation: fadeIn ease 0.5s;
  -ms-animation: fadeIn ease 0.5s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 600px) {
    max-width: 100%;
    max-height: 100%;
  }
`;

const UserCont = styled.div`
  width: 24vw;
  height: 24vw;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100%;
    height: 100%;
  }

  .user {
    color: #ccc;
    font-size: 12vw;

    @media only screen and (max-width: 600px) {
      font-size: 40vw;
    }
  }
`;

const Review = styled.div`
  height: 2.5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1vw;
  padding-right: 1vw;
  box-sizing: border-box;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    height: 10vw;
    padding-left: 3vw;
    padding-right: 3vw;
    // padding-top: 1vw;
  }

  .unlikedIcon {
    color: #ddd;
    font-size: 1.5vw;
    transform: scale(0.9);
    margin-right: 0.25vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      transform: scale(0.9);
      margin-right: 1vw;
    }
  }
  .likedIcon {
    color: #bb3394;
    transform: scale(1);
    font-size: 1.5vw;
    margin-right: 0.25vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      transform: scale(1);
      margin-right: 1vw;
    }
  }
`;

const Likes = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8vw;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
  }
`;

const PostTime = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;

  span {
    color: #ddd;
    font-size: 0.8vw;
    font-style: italic;

    @media only screen and (max-width: 600px) {
      font-size: 3vw;
    }
  }
`;

const TextReview = styled.span`
  cursor: pointer;
  color: ${(props) => props.theme.secondLevel};
  transition: ease-in-out 200ms;
  font-size: 0.8vw;
  letter-spacing: 0;
  margin-bottom: 0.1vw;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
    margin-bottom: 0.2vw;
  }

  :hover {
    color: #444;
    text-decoration: underline;
  }
`;
