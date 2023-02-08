import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaUserEdit } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { BiShoppingBag } from "react-icons/bi";
import { BsBrush } from "react-icons/bs";
import { RiHomeHeartLine } from "react-icons/ri";
import { MdAddBusiness, MdLocationPin, MdLibraryAdd } from "react-icons/md";
import { FcBusinessContact } from "react-icons/fc";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPhoneAlt,
  FaChrome,
} from "react-icons/fa";
import { AiOutlineMail, AiOutlineDelete } from "react-icons/ai";
import { ImCheckmark } from "react-icons/im";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { CoverUploader } from "../../components/coverUploader";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { ImgUploader } from "../../components/imgUploader";
import { db, storage } from "../../firebase";
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
import { AuthContext } from "../../context/AuthContext";
import { setLoading, setRerender } from "../../redux/main";
import { Loading } from "../../components/loading";
import { UserImages } from "../../pages/user/images";
import { Services } from "../../pages/user/services";
import { Products } from "../../pages/user/userProducts";
import { Followers } from "../../pages/user/followers";
import { Followings } from "../../pages/user/followings";
import { FaUser } from "react-icons/fa";
import { Links } from "../../pages/user/links";
import Map from "../../components/map";
import { Navigator } from "../../pages/user/navigator";
import { setContentChanger } from "../../redux/user";
import { Info } from "../../pages/user/info";
import useWindowDimensions from "../../functions/dimensions";
import { Spinner } from "../../components/loader";

const UserVisitPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { Id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  // define content
  const contentChanger = useSelector((state) => state.storeUser.contentChanger);

  React.useEffect(() => {
    setLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [contentChanger]);

  const openImg = useSelector((state) => state.storeMain.openImg);

  // get user by params id
  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }
  const user = users?.find((item) => item.id === Id);

  // define mobile or desktop
  const isMobile = useWindowDimensions();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      // behavior: "smooth",
    });
    if (user?.type == "user") {
      if (isMobile) {
        dispatch(setContentChanger("contact"));
      } else {
        dispatch(setContentChanger("followings"));
      }
    } else if (user?.type == "shop") {
      dispatch(setContentChanger("products"));
    } else if (user?.type == "beautyCenter") {
      dispatch(setContentChanger("services"));
    } else {
      dispatch(setContentChanger("posts"));
    }
  }, []);

  // define cover icon

  let coverIcon;
  if (user?.type == "shop") {
    coverIcon = <BiShoppingBag />;
  } else if (user?.type == "beautyCenter") {
    coverIcon = <RiHomeHeartLine />;
  } else if (user?.type == "specialist") {
    coverIcon = <BsBrush />;
  } else {
    coverIcon = <ImProfile />;
  }

  // import user gallery images from firestore
  const [feeds, setFeeds] = useState("");

  React.useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${Id}`, "feeds"),
      (snapshot) => {
        setFeeds(snapshot.docs.map((doc) => doc.data()));
      }
    );
    return data;
  }, [contentChanger]);

  /** Define following to user or not
   * //
   */

  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  //import followings
  const followings = useSelector((state) => state.storeMain.followings);

  // define if props user is in your followings list
  const following = followings.find((item) => item.id == user.id);

  const userToFollow = user;

  // function to follow user
  const FollowToUser = async () => {
    setDoc(
      doc(db, `users`, `${currentUser?.uid}`, "followings", `${user?.id}`),
      {
        ...user,
      }
    );
    setDoc(
      doc(db, `users`, `${user?.uid}`, "followers", `${currentUser?.uid}`),
      {
        ...currentuser,
      }
    );
  };
  // function to unfollow user
  const UnFollowToUser = () => {
    const coll = collection(db, `users`, `${currentUser?.uid}`, "followings");
    deleteDoc(doc(coll, `${user?.id}`));
  };

  let content;
  if (contentChanger == "posts") {
    content = <UserImages userVisit={true} user={user} feeds={feeds} />;
  } else if (contentChanger == "contact") {
    content = <Info userVisit={true} user={user} />;
  } else if (contentChanger == "services") {
    content = <Services userVisit={true} user={user} />;
  } else if (contentChanger == "products") {
    content = <Products userVisit={true} user={user} />;
  } else if (contentChanger == "followers") {
    content = <Followers userVisit={true} user={user} />;
  } else if (contentChanger == "followings") {
    content = <Followings userVisit={true} user={user} />;
  }

  // capitalize first letters
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const type = capitalizeFirstLetter(user?.type);
  const name = capitalizeFirstLetter(user?.name);

  setTimeout(() => {
    setLoading(false);
  }, 500);

  return (
    <>
      <Container>
        <InfoSide>
          <InfoWrapper>
            <ProfileImg>
              {user?.cover?.length > 0 ? (
                <CoverImg src={user?.cover} alt="photo" />
              ) : (
                <FaUser className="undefinedUserIcon" />
              )}
            </ProfileImg>
            {/* <ImgUploader /> */}
            <TitleContainer>
              <Type>{type}</Type>
              <Title following={following}>
                {coverIcon} {name}
                <>
                  {currentUser !== null ? (
                    <>
                      {user?.id !== currentUser?.uid && (
                        <>
                          {following?.id?.length > 0 ? (
                            <ImCheckmark
                              className="followIcon"
                              following={true}
                              onClick={UnFollowToUser}
                            />
                          ) : (
                            <ImCheckmark
                              className="followIcon"
                              onClick={FollowToUser}
                            />
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    () => navigate("/login")
                  )}
                </>
              </Title>
              {/* <Profession>{user?.services}</Profession> */}
            </TitleContainer>
          </InfoWrapper>
          {user?.type != "user" && (
            <>
              <WorkingInfo>
                <div style={{ height: 0, zIndex: 4 }}>
                  <div style={{ position: "relative", bottom: "12vw" }}>
                    <Map
                      latitude={user?.adress?.latitude}
                      longitude={user?.adress?.longitude}
                      userVisit={true}
                    />
                  </div>
                </div>
                <StaticInfo>
                  <Location>
                    <MdLocationPin /> {user?.adress?.country},{" "}
                    {user?.adress?.city}, {user?.adress?.destrict}
                    {user?.adress?.destrict?.length > 0 ? "," : ""}{" "}
                    {user?.adress?.adress}
                    {user?.adress?.streetNumber?.length > 0 ? " N" : ""}
                    {user?.adress?.streetNumber}
                    {user?.adress?.addationalAdress}
                  </Location>
                </StaticInfo>
              </WorkingInfo>
            </>
          )}
        </InfoSide>
        <ContentSide>
          <div className="links">
            <Links user={user} userVisit={true} />
          </div>
          {user?.type != "user" && (
            <ContentRightSide>
              <Navigator userVisit={true} type={user?.type} />
              {loading ? (
                <LoadingContainer>
                  <Spinner />
                </LoadingContainer>
              ) : (
                <>{content}</>
              )}
            </ContentRightSide>
          )}
        </ContentSide>
      </Container>
    </>
  );
};

export default UserVisitPage;

const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.9vw;
  z-index: 1;
  overflow-x: hidden;

  @media only screen and (max-width: 600px) {
    padding-top: 14vw;
    box-sizing: border-box;
  }
`;

const InfoSide = styled.div`
  width: 70%;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  padding: 1.5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;

  @media only screen and (max-width: 600px) {
    width: 100%;
    box-sizing: border-box;
    padding: 3vw 4vw;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ProfileImg = styled.div`
  background: #fff;
  width: 8vw;
  height: 8vw;
  border-radius: 50vw;
  box-shadow: 0 0 0 0.3vw rgba(2, 2, 2, 0.05);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0 0 1vw rgba(2, 2, 2, 0.05);
    width: 20vw;
    height: 20vw;
  }

  .undefinedUserIcon {
    color: ${(props) => props.theme.disabled};
    font-size: 3.2vw;
    @media only screen and (max-width: 600px) {
      font-size: 10vw;
    }
  }
`;
const AddImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15vw;
  height: 15vw;
  border: 0.25vw solid #fff;
  border-radius: 0.5vw;

  .uploaderIcon {
    font-size: 5vw;
    color: ${(props) => props.theme.disabled};
    position: relative;
    left: 5vw;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-left: 2vw;

  @media only screen and (max-width: 600px) {
    width: 50vw;
    padding-left: 6vw;
  }
`;

const Title = styled.span`
  font-size: 1.5vw;
  font-weight: bold;
  letter-spacing: 0.03vw;
  margin: 0.5vw 0;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;

  .followIcon {
    font-size: 1.5vw;
    color: ${(props) => (props.following != undefined ? "green" : "#ccc")};
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
    }
  }

  @media only screen and (max-width: 600px) {
    font-size: 4vw;
    margin: 1.5vw 0;
    gap: 1.5vw;
    letter-spacing: 0.2vw;
  }
`;

const Type = styled.span`
  color: ${(props) => props.theme.disabled};
  font-size: 1.1vw;
  font-weight: bold;
  letter-spacing: 0.03vw;

  @media only screen and (max-width: 600px) {
    font-size: 3.5vw;
  }
`;

const Profession = styled.span`
  color: ${(props) => props.theme.filterFontActive};
  font-size: 0.9vw;
  letter-spacing: 0.03vw;
  font-style: italic;
`;
const WorkingInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-end;
  width: 40%;
  height: 10vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  overflow: hidden;
  border-radius: 0.5vw;

  .workingInfoIcon {
    font-size: 1.5vw;
  }

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const StaticInfo = styled.div`
  z-index: 5;
  background: rgba(255, 255, 255, 0.9);
  padding: 1vw;
  margin: 0 0 0.5vw 0.5vw;
  border-radius: 0.5vw;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 0.5vw;
`;

const Location = styled.div`
  color: ${(props) => props.theme.filterFontActive};
  font-size: 0.75vw;
  letter-spacing: 0.03vw;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.25vw;
  text-align: end;
`;

const CoverImg = styled.img`
  object-fit: cover;
  width: 9vw;
  height: 9vw;
  position: relative;
  z-index: 5;

  @media only screen and (max-width: 600px) {
    width: 20vw;
    height: 20vw;
  }
`;

const ContentSide = styled.div`
  width: 70%;
  height: auto;
  height: 100%;
  z-index: 0;
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
`;
