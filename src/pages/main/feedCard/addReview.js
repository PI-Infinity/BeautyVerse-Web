import React, { useState, useContext } from "react";
import styled from "styled-components";
import {
  setDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";
import { useSelector } from "react-redux";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { FiSend } from "react-icons/fi";
import { v4 } from "uuid";
import { BiStar } from "react-icons/bi";

export const AddReview = (props) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const rerender = useSelector((state) => state.storeMain.rerender);

  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  /**
   * add review to firebase
   *  */
  const AddingReview = async () => {
    var id = new Date().toString();
    var addTime = serverTimestamp();
    // add review to target user
    await setDoc(
      doc(
        db,
        `users`,
        `${props.id}`,
        "feeds",
        `${props.currentFeed?.id}`,
        "reviews",
        `${id}`
      ),
      {
        id: id,
        time: addTime,
        reviewer: props.currentuser?.name,
        reviewerId: props.currentuser?.id,
        reviewerCover:
          props.currentuser?.cover != undefined
            ? props.currentuser?.cover
            : null,
        text: props.reviewText,
        reciever: props.name,
        recieverId: props.id,
        recieverCover: props?.cover != undefined ? props?.cover : null,
      }
    );

    var actionId = v4();
    if (props?.id !== currentUser?.uid) {
      setDoc(doc(db, `users`, `${props?.id}`, "notifications", `${actionId}`), {
        id: actionId,
        senderId: currentUser?.uid,
        review: props.reviewText,
        text: `დაგიტოვათ კომენტარი პოსტზე!`,
        date: serverTimestamp(),
        type: "review",
        status: "unread",
        feed: `${window.location.pathname}`,
      });
    }
    props.setReviewText("");
  };

  const [stars, setStars] = useState([]);
  // get stars
  React.useEffect(() => {
    let data = onSnapshot(
      collection(
        db,
        "users",
        `${props?.state?.userId}`,
        "feeds",
        `${props?.currentFeed?.id}`,
        `${props?.state?.userId}+stars`
      ),
      (snapshot) => {
        setStars(snapshot.docs.map((doc) => doc.data()));
      }
    );
    return data;
  }, [props?.path, props?.state, props?.currentFeed, props?.state?.imgNumber]);

  // give heart to user
  const SetStar = async () => {
    await setDoc(
      doc(
        db,
        `users`,
        `${props?.state?.userId}`,
        "feeds",
        `${props?.currentFeed?.id}`,
        `${props?.state?.userId}+stars`,
        currentuser?.id
      ),
      {
        id: currentuser?.id,
        date: serverTimestamp(),
      }
    );
    var actionId = v4();
    if (props?.state?.userId !== currentUser?.uid) {
      setDoc(
        doc(
          db,
          `users`,
          `${props?.state?.userId}`,
          "notifications",
          `${actionId}`
        ),
        {
          id: actionId,
          senderId: currentUser?.uid,
          text: `მიანიჭა ვარსკვლავი თქვენ პოსტს!`,
          date: serverTimestamp(),
          type: "star",
          status: "unread",
          feed: `${window.location.pathname}`,
        }
      );
    }
  };

  const isStarGiven = stars?.find((item) => item.id === currentuser?.id);

  // remove heart
  const RemoveStar = async () => {
    await deleteDoc(
      doc(
        db,
        `users`,
        `${props?.state?.userId}`,
        "feeds",
        `${props?.currentFeed?.id}`,
        `${props?.state?.userId}+stars`,
        currentuser?.id
      )
    );
  };

  return (
    <ReviewContainer>
      {props.currentuser?.id !== undefined && (
        <Footer>
          <Likes>
            {isStarGiven != undefined ? (
              <BiStar className="likedIcon" onClick={RemoveStar} />
            ) : (
              <BiStar
                className="unlikedIcon"
                onClick={
                  props.currentuser != ""
                    ? SetStar
                    : async () => {
                        await props.setOpenFeed(false);
                        navigate("/login");
                      }
                }
              />
            )}
            {stars?.length}
          </Likes>
          <AddReviewContainer
            value={props.reviewText}
            type="text"
            placeholder="Add Review"
            onChange={(e) => props.setReviewText(e.target.value)}
          />{" "}
          <FiSend
            className="send"
            onClick={props.reviewText?.length > 0 ? AddingReview : null}
          />
        </Footer>
      )}
    </ReviewContainer>
  );
};

const ReviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  max-height: 55%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1vw;
  box-sizing: border-box;
  margin-top: auto;

  .send {
    color: ${(props) => props.theme.icon};
    font-size: 24px;
    margin-left: 0.2vw;
    cursor: pointer;
    width: 15%;

    @media only screen and (max-width: 600px) {
      margin-left: 0;
    }
  }

  @media only screen and (max-width: 600px) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    margin-left: auto;
    padding: 1.5vw 3vw 1.5vw 3vw;
    box-shadow: 0 -0.3vw 0.9vw ${(props) => props.theme.shadowColor};
    background: ${(props) => props.theme.secondLevel};
    z-index: 10006;
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

const AddReviewContainer = styled.input`
  border: none;
  color: #fff;
  background: #050505;
  width: 100%;
  padding: 0.5vw;
  border-radius: 50vw;

  @media only screen and (max-width: 600px) {
    padding: 2vw 2vw 2vw 3vw;
    font-size: 16px;
    box-sizing: border-box;
  }

  ::placeholder {
    color: #fff;
    font-size: 14px;
  }

  :focus {
    outline: none;
  }
`;

const Likes = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  width: 15%;
  color: ${(props) => props.theme.font};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 15px;
  font-size: 14px;
`;
