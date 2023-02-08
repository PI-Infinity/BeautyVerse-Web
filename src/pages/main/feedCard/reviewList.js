import React, { useContext } from "react";
import styled from "styled-components";
import { MdOutlineRemove } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { AuthContext } from "../../../context/AuthContext";

export const ReviewList = (props) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const RemoveReview = async (reviewer, i) => {
    await deleteDoc(
      doc(
        db,
        `users`,
        `${props.id}`,
        "feeds",
        `${props.currentFeed?.id}`,
        "reviews",
        `${i}`
      )
    );
    await deleteDoc(
      doc(db, `reviews`, `${reviewer + props.currentFeed?.id + i}`)
    );
    props.setReviewText("");
  };

  return (
    <ReviewListContainer>
      {props?.reviews
        ?.sort((a, b) => b?.time?.seconds - a?.time?.seconds)
        .map((item, index) => {
          return (
            <ReviewItem key={index}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                }}
              >
                {item.reviewerCover != null ? (
                  <Img src={item.reviewerCover} alt="beautyverse" />
                ) : (
                  <UserProfileEmpty>
                    <FaUser className="user" />
                  </UserProfileEmpty>
                )}

                <Reviewer
                  onClick={
                    currentUser?.uid === item?.reviewerId
                      ? () => navigate("/user")
                      : () => navigate(`/user/${item?.reviewerId}`)
                  }
                >
                  {item.reviewer}
                </Reviewer>
                <span style={{ fontSize: "12px", color: "#ccc" }}>
                  {new Date(item.time?.seconds * 1000).toString().slice(4, 24)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    wordWrap: "break-word",
                    width: "90%",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textAlign: "start",
                    background: "#f3f3f3",
                    borderRadius: "0 15px 15px 15px",
                    padding: "5px 15px",
                    // marginLeft: "5px",
                  }}
                >
                  {item.text}
                </div>
                {props.currentuser?.id !== undefined &&
                  (item?.reviewerId === props.currentuser?.id ||
                    item.recieverId === props.currentuser?.id) && (
                    <MdOutlineRemove
                      onClick={() => RemoveReview(item.reviewerId, item.id)}
                      style={{
                        minWidth: "5%",
                        textAlign: "center",
                        fontSize: "16px",
                        cursor: "pointer",
                      }}
                    />
                  )}
              </div>
            </ReviewItem>
          );
        })}
    </ReviewListContainer>
  );
};

const ReviewListContainer = styled.div`
  overflow-y: scroll;
  width: 100%;
  height: auto;
  max-height: 50%;
  margin-top: 0.5vw;
  margin-bottom: 1vw;
  padding: 0.5vw;
  color: #444;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    height: auto;
    overflow: hidden;
    max-height: 100%;
    padding: 0;
    padding-bottom: 20vw;
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
    background-color: #444;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;

const ReviewItem = styled.div`
  width: 100%;
  // background: #fff;
  border-radius: 0.25vw;
  padding: 0.5vw;
  box-sizing: border-box;
  margin-bottom: 0.3vw;
  // box-shadow: 0 0.1vw 0.2vw rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 0.5vw;
  font-size: 0.8vw;

  @media only screen and (max-width: 600px) {
    // box-shadow: 0 0.2vw 0.6vw rgba(0, 0, 0, 0.1);
    padding: 1.5vw;
    border-radius: 1vw;
    margin-bottom: 1vw;
    font-size: 3vw;
    gap: 2.5vw;
  }
`;
const Img = styled.img`
  width: 1.5vw;
  height: 1.5vw;
  cursor: pointer;
  object-fit: cover;
  border-radius: 50vw;

  :hover {
    filter: brightness(0.97);
  }

  @media only screen and (max-width: 600px) {
    width: 6vw;
    height: 6vw;
  }
`;

const UserProfileEmpty = styled.div`
  width: 1.5vw;
  height: 1.5vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 6vw;
    height: 6vw;
  }

  .user {
    font-size: 1.2vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;

const Reviewer = styled.div`
  font-weight: bold;
  margin-right: 5px;
  transition: ease 200ms;
  cursor: pointer;
  width: auto;
  min-width: 40%;

  @media only screen and (max-width: 600px) {
    margin-right: 2vw;
  }

  :hover {
    text-decoration: underline;
  }
`;
