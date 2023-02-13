import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { FaUserEdit } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
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
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import {
  setLoading,
  setRerender,
  setImgTargetGallery,
  setOpenImg,
  setCurrentImgNumber,
} from "../../redux/main";
import {
  setImgNumber,
  setUserId,
  setUserCover,
  setUserName,
  setUserType,
  setOpenFeed,
} from "../../redux/feed";
import { Loading } from "../../components/loading";
import { BsStars, BsLayoutTextSidebarReverse } from "react-icons/bs";
import Loader from "react-js-loader";
import useWindowDimensions from "../../functions/dimensions";
import { IsMobile } from "../../functions/isMobile";
import { useNavigate } from "react-router-dom";
import { HiOutlineViewGridAdd } from "react-icons/hi";
import { useOutletContext } from "react-router-dom";
import { isWebpSupported } from "react-image-webp/dist/utils";

export const UserFeeds = () => {
  const [user] = useOutletContext();
  const { currentUser } = useContext(AuthContext);
  const isMobile = IsMobile();
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  }, []);

  // current user info from redux
  const userUnparsed = useSelector((state) => state.storeMain.user);

  // loading images
  const [loadingImg, setLoadingImg] = useState(true);

  // remove confirming window
  const [confirm, setConfirm] = useState("");

  /** after getting files from firestore define list */
  const DefineList = (gall) => {
    if (gall?.length > 0) {
      let list = gall
        ?.sort((a, b) => {
          return b?.addTime?.seconds - a?.addTime?.seconds;
        })
        .map((item, index) => {
          return (
            <GalleryImg key={index}>
              {user?.id === currentUser?.uid && (
                <div
                  style={{ height: 0, display: "flex", justifyContent: "end" }}
                >
                  <RemoveIconContainer
                    onClick={() => setConfirm(item.id, item.name)}
                  >
                    <AiOutlineDelete className="removeIcon" />
                  </RemoveIconContainer>
                </div>
              )}
              {item?.name?.endsWith("mp4") ? (
                <Video
                  width="100%"
                  height="auto"
                  controls
                  onClick={() =>
                    navigate(`/user/${user?.id}/feed/${item?.id}/${index}`)
                  }
                >
                  <source src={item?.url} type="video/mp4" />
                </Video>
              ) : (
                <>
                  {isMobile ? (
                    isWebpSupported() ? (
                      <Img
                        src={item?.mobileWEBPurl}
                        alt="item"
                        style={{ zIndex: 5 }}
                        onClick={() =>
                          navigate(
                            `/user/${user?.id}/feed/${item?.id}/${index}`
                          )
                        }
                      />
                    ) : (
                      <Img
                        src={item?.mobileJPEGurl}
                        alt="item"
                        style={{ zIndex: 5 }}
                        onClick={() =>
                          navigate(
                            `/user/${user?.id}/feed/${item?.id}/${index}`
                          )
                        }
                      />
                    )
                  ) : (
                    <Img
                      src={item?.desktopJPEGurl}
                      alt="item"
                      style={{ zIndex: 5 }}
                      onClick={() =>
                        navigate(`/user/${user?.id}/feed/${item?.id}/${index}`)
                      }
                    />
                  )}
                </>
              )}
            </GalleryImg>
          );
        });
      return list;
    }
  };

  const list = DefineList(feeds);

  /** delete image from firestore and cloud */
  const Deleting = async (deleteItem, itemName) => {
    const values = [];
    /** delete from firestore
     */
    const coll = collection(db, `users/${user?.id}/feeds/`);
    setConfirm("");
    await deleteDoc(doc(coll, `${deleteItem}`));
    /** delete from cloude
     */
    // Create a reference to the file to delete
    let desertRef;
    if (itemName?.endsWith("mp4")) {
      desertRef = await ref(storage, `videos/${user?.id}/feeds/${deleteItem}/`);
    } else {
      desertRef = await ref(storage, `images/${user?.id}/feeds/${deleteItem}/`);
    }
    // Delete the file
    listAll(desertRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          values?.push(itemRef);
        });
        if (values !== "") {
          values?.map((item) => {
            console.log(item);
            if (item?.name.includes(".mp4")) {
              deleteObject(
                ref(
                  storage,
                  `videos/${user?.id}/feeds/${deleteItem}/${item.name}`
                )
              ).then(() => {
                console.log("storage success");
              });
            } else {
              deleteObject(
                ref(
                  storage,
                  `images/${user?.id}/feeds/${deleteItem}/${item.name}`
                )
              ).then(() => {
                console.log("storage success");
              });
            }
          });
        }
      })
      .catch((error) => {
        console.log("error : " + error);
      });
    // window.location.reload();
  };

  React.useEffect(() => {
    setTimeout(() => {
      setLoadingImg(false);
    }, 300);
  }, []);

  return (
    <>
      {confirm?.length > 0 && (
        <Confirm>
          <ConfirmCont>
            <ConfirmText>Are you sure to delete this file?</ConfirmText>
            <Answers>
              <Answer name="no" onClick={() => setConfirm("")}>
                Cancel
              </Answer>
              <Answer name="yes" onClick={() => Deleting(confirm)}>
                Delete
              </Answer>
            </Answers>
          </ConfirmCont>
        </Confirm>
      )}
      <Container height={height}>
        <Content listLength={list?.length}>
          {user?.id === currentUser?.uid && user?.type != "user" && (
            <GalleryImg
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => navigate("/add")}
            >
              <HiOutlineViewGridAdd id="add" />
            </GalleryImg>
          )}
          {list?.length > 0 == true ? list : ""}
        </Content>
      </Container>
    </>
  );
};

const Confirm = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: rgba(2, 2, 2, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: ease-in-out 300ms;
`;

const ConfirmCont = styled.div`
  width: 50%;
  height: 20vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap 3vw;

  animation: fadeIn 0.25s;
  -webkit-animation: fadeIn 0.25s;
  -moz-animation: fadeIn 0.25s;
  -o-animation: fadeIn 0.25s;
  -ms-animation: fadeIn 0.25s;

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
    width: 80vw;
    height: 50vw;
    border-radius: 1.5vw;
    gap: 6vw;
  }
`;

const ConfirmText = styled.h2`
  @media only screen and (max-width: 600px) {
    font-size: 3.6vw;
  }
`;

const Answers = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 20vw;

  @media only screen and (max-width: 600px) {
    width: 60vw;
  }
`;

const Answer = styled.div`
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  background: ${(props) => (props.name != "yes" ? "#35B453" : "#de4360")};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8vw;
  height: 2vw;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    width: 25vw;
    height: 7vw;
    border-radius: 1.5vw;
  }

  :hover {
    filter: ${(props) =>
      props.name === "yes" ? "brightness(1.05)" : "brightness(0.95)"};
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 28vw;
  padding-bottom: 5vw;

  @media only screen and (max-width: 600px) {
    height: calc(${(props) => props.height}px - 60vw);
    box-sizing: border-box;
    padding: 2vw 4vw;
  }
`;

// const AddImg = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 14vw;
//   height: 14vw;
//   border: 0.25vw solid #fff;
//   border-radius: 0.5vw;

//   @media only screen and (max-width: 600px) {
//     width: 27vw;
//     height: 27vw;
//     border-radius: 1.5vw;
//     border: 0.75vw solid #fff;
//   }

//   .uploaderIcon {
//     font-size: 5vw;
//     color: #ccc;
//     position: relative;
//     left: 5vw;

//     @media only screen and (max-width: 600px) {
//       font-size: 12vw;
//       left: 2vw;
//     }
//   }
// `;

const Content = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 1.5vw;
  width: 100%;
  height: 100%;
  min-height: 50vh;
  flex-wrap: wrap;
  gap: 0.5vw;
  height: auto;
  margin-bottom: 7vw;

  @media only screen and (max-width: 600px) {
    min-height: auto;
    gap: 2vw;
    padding-left: 1vw;
  }

  .loadingIcon {
    font-size: 3vw;
  }
`;

const GalleryImg = styled.div`
  width: 14vw;
  height: 14vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  overflow: hidden;
  border: 0.25vw solid #fff;
  cursor: pointer;

  animation: fadeIn 1s;
  -webkit-animation: fadeIn 1s;
  -moz-animation: fadeIn 1s;
  -o-animation: fadeIn 1s;
  -ms-animation: fadeIn 1s;

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
    width: 28vw;
    height: 28vw;
    border-radius: 1.5vw;
    border: 0.25vw solid #fff;
  }

  :hover {
    filter: brightness(0.99);
  }

  #add {
    font-size: 3.5vw;
    color: #ccc;
    @media only screen and (max-width: 600px) {
      font-size: 9vw;
    }
  }
`;

const RemoveIconContainer = styled.div`
  background: rgba(2, 2, 2, 0.5);
  width: 2vw;
  height: 2vw;
  z-index: 6;
  position: relative;
  right: 0.5vw;
  top: 0.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  transition: ease-in-out 200ms;

  @media only screen and (max-width: 600px) {
    width: 6vw;
    height: 6vw;
    top: 1.5vw;
    right: 1.5vw;
  }

  :hover {
    background: rgba(2, 2, 2, 0.2);
  }

  .removeIcon {
    font-size: 1.2vw;
    color: #fff;
    transition: ease-in-out 200ms;

    @media only screen and (max-width: 600px) {
      font-size: 3.6vw;
    }

    :hover {
      color: #de4360;
    }
  }
`;

const Img = styled.img`
  object-fit: cover;
  width: 14vw;
  height: 14vw;
  position: relative;
  z-index: 5;
  background: #f6f7ff;

  @media only screen and (max-width: 600px) {
    width: 28vw;
    height: 28vw;
    border-radius: 1.5vw;
  }
`;

const Video = styled.video`
  width: 14vw;
  height: 14vw;
  position: relative;
  z-index: 5;
  background: #050505;

  @media only screen and (max-width: 600px) {
    width: 28vw;
    height: 28vw;
    border-radius: 1.5vw;
  }
`;

const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
