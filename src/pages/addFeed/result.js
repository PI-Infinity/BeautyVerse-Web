import React, { useContext } from "react";
import styled from "styled-components";
import { BiStar } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setRerender } from "../../redux/main";
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
} from "firebase/firestore";
import { TopSection } from "../../pages/main/feedCard/topSection";
import { FaUser } from "react-icons/fa";
import useWindowDimensions from "../../functions/dimensions";
import { IoMdImages } from "react-icons/io";

export const Result = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // capitalize first letters

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const name = capitalizeFirstLetter(props?.name);
  const userType = capitalizeFirstLetter(props?.type);

  const DefineUrl = () => {
    if (props.file) {
      return URL?.createObjectURL(props?.file);
    }
  };
  const url = React.useMemo(() => DefineUrl(), [props.file?.name]);

  console.log(props.file);

  return (
    <div
      style={{
        overfloY: "scroll",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Container active={props.active}>
        <TopSection
          cover={props.cover}
          name={name}
          userType={userType}
          testFeed={true}
        />
        <div
          style={{
            padding: "0px 15px",
            margin: "0 0 25px 0",
            overflowY: "scroll",
            maxHeight: "15vw",
          }}
        >
          {props.text?.length > 0 && (
            <p style={{ whiteSpace: "pre-line", margin: "0 5px 10px 5px" }}>
              {props.text}
            </p>
          )}
        </div>
        <div>
          {props.file ? (
            <div
              style={{
                // height: "100%",
                // width: "100%",
                position: "relative",
              }}
            >
              {props.file?.type?.endsWith("mp4") ? (
                <>
                  <input
                    type="file"
                    id="img"
                    accept=".jpg, .jpeg, .png, .mp4, .webp"
                    style={{ display: "none" }}
                    onChange={props.onImageChange}
                  />
                  <label
                    htmlFor="img"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Video width="100%" height="auto" controls autoplay muted>
                      <source src={url} type="video/mp4" />
                    </Video>
                  </label>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    id="img"
                    style={{ display: "none" }}
                    accept=".jpg, .jpeg, .png, .mp4, .webp"
                    onChange={props.onImageChange}
                  />
                  <label
                    htmlFor="img"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Cover src={url} active={props.active} />
                  </label>
                </>
              )}
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "150px 0",
              }}
            >
              <input
                type="file"
                id="img"
                style={{ display: "none" }}
                onChange={props.onImageChange}
              />
              <label
                htmlFor="img"
                style={{ display: "flex", alignItems: "center" }}
              >
                <IoMdImages className="icon" />
                <span style={{ color: "#ccc" }}>(JPG / JPEG / PNG / MP4)</span>
              </label>
            </div>
          )}
        </div>

        <Review>
          <div style={{ flex: 1 }}>
            <Likes>
              <BiStar className="likedIcon" /> 0
            </Likes>
          </div>

          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <TextReview>(0) შეფასებები</TextReview>
          </div>
          <PostTime>
            <span>1hr ago</span>
          </PostTime>
        </Review>
      </Container>
      <Button
        onClick={
          props.file != null
            ? async () => {
                await props.FileUpload();
                await dispatch(setRerender());
              }
            : () => alert("Add File")
        }
      >
        Add Feed
      </Button>
    </div>
  );
};

const Divider = styled.div`
  display: none;
  @media only screen and (max-width: 600px) {
    display: flex;
    height: 1.5vw;
    background: rgba(0, 10, 61, 0.15);
    width: 100%;
  }
`;

const Container = styled.div`
  width: 32vw;
  height: auto;
  max-height: 48vw;
  max-width: 32vw;
  border-radius: 0.5vw;
  display: flex;
  flex-direction: column;
  justify-content: start;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  background: white;
  transition: ease 250ms;
  opacity: ${(props) => (props.loading ? 0 : 1)};

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: auto;
    max-height: 200vw;
    max-width: 100vw;
    border-radius: 0;
    box-sizing: border-box;
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
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    max-width: 100%;
    max-height: 100%;
  }
`;

const UserCont = styled.div`
  width: 24vw;
  height: ${(props) => (props.active === "Desktop" ? "24vw" : "100%")}
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

const Button = styled.div`
  width: 15vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease-in 200ms;
  color: ${(props) => (props.back ? "#ccc" : "green")};
  font-weight: bold;
  background: rgba(255, 255, 255, 0.7);
  margin-top: 0.5vw;

  @media only screen and (max-width: 600px) {
    width: 45vw;
    height: 8vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.6vw rgba(2, 2, 2, 0.2);
    font-size: 3.8vw;
    margin: 6vw 0 4vw 0;
  }

  :hover {
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.2);
  }
`;
