import { useContext } from "react";
import styled from "styled-components";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
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
        senderName: currentuser?.name,
        senderCover: currentuser?.cover?.length > 0 ? currentuser?.cover : "",
        review: props.reviewText,
        text: `დაგიტოვათ კომენტარი პოსტზე!`,
        date: serverTimestamp(),
        type: "review",
        status: "unread",
        feed: `${window.location.pathname}`,
      });
      props.setReviewText("");
    }
  };

  return (
    <ReviewContainer>
      {props.currentuser?.id !== undefined && (
        <Footer>
          <Likes>
            {props.isStarGiven != undefined ? (
              <BiStar className="likedIcon" onClick={props.RemoveStar} />
            ) : (
              <BiStar
                className="unlikedIcon"
                onClick={
                  props.currentuser != ""
                    ? props.SetStar
                    : async () => {
                        await props.setOpenFeed(false);
                        navigate("/login");
                      }
                }
              />
            )}
            {props.stars?.length}
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
    font-size: 1.8vw;
    margin-left: 0.2vw;
    cursor: pointer;
    width: 15%;

    @media only screen and (max-width: 600px) {
      font-size: 7vw;
      margin-left: 0;
    }
  }

  @media only screen and (max-width: 600px) {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    margin-left: auto;
    padding: 3vw 3vw 0vw 3vw;
    box-shadow: 0 -0.3vw 0.9vw ${(props) => props.theme.shadowColor};
    background: ${(props) => props.theme.secondLevel};
    backdrop-filter: blur(40px);
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
  }

  :focus {
    outline: none;
  }
`;

const Likes = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2vw;
  width: 15%;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 15px;
  margin-bottom: 15px;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
  }
`;
