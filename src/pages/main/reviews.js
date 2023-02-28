import React, { useContext } from "react";
import styled from "styled-components";
import { AiOutlineComment } from "react-icons/ai";
import { MdOutlineArrowRight } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { onSnapshot, collectionGroup } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { Language } from "../../context/language";
import GetTimesAgo from "../../functions/getTimesAgo";

export const Reviews = () => {
  const { currentUser } = useContext(AuthContext);
  const language = Language();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rerender = useSelector((props) => props.storeMain.rerender);

  // get reviews from users
  const [reviewList, setReviewList] = React.useState([]);
  React.useEffect(() => {
    const data = onSnapshot(collectionGroup(db, "reviews"), (snapshot) => {
      setReviewList(snapshot.docs.map((doc) => doc.data()));
    });
    return data;
  }, []);

  return (
    <Container>
      <Title>
        {language?.language?.Main?.reviews?.title}{" "}
        <AiOutlineComment className="likedIcon" />
      </Title>
      <List>
        {reviewList
          ?.sort((a, b) => b?.time?.seconds - a?.time?.seconds)
          ?.map((item, index) => {
            let currentPostTime = GetTimesAgo(item?.time?.seconds);
            let timeTitle;
            if (currentPostTime?.title === "h") {
              timeTitle = language?.language.Main.feedCard.h;
            } else if (currentPostTime?.title === "min") {
              timeTitle = language?.language.Main.feedCard.min;
            }
            return (
              <div key={index}>
                <div
                  style={{
                    width: "92%",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      color: "#ddd",
                      fontSize: "0.7vw",
                      // fontWeight: "bold",
                      fontStyle: "italic",
                      marginLeft: "1vw",
                      marginBottom: "0.5vw",
                    }}
                  >
                    {currentPostTime === "Just now"
                      ? language?.language.Main.feedCard.justNow
                      : currentPostTime?.numbers + " " + timeTitle}
                  </span>
                </div>
                <ReviewItem>
                  <Reviewer
                    onClick={() => navigate(`/user/${item?.reviewerId}`)}
                  >
                    {item.reviewer}
                  </Reviewer>
                  <MdOutlineArrowRight className="arrowIcon" />
                  <Reviewer
                    onClick={() => navigate(`/user/${item?.reviewerId}`)}
                    style={{ color: "#46BCFF" }}
                  >
                    {item.reciever}
                  </Reviewer>
                  <span id="text" style={{ fontSize: "0.7vw" }}>
                    {item.text}
                  </span>{" "}
                </ReviewItem>
              </div>
            );
          })}
      </List>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 20vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-right: 2vw;
  padding-bottom: 0.5vw;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};
`;

const Title = styled.div`
  width: 100%;
  color: ${(props) => props.theme.font};
  display: flex;
  gap: 0.25vw;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1.25vw;
  font-weight: bold;
  padding-bottom: 0.5vw;

  .likedIcon {
    margin-right: 2vw;
    font-size: 1.1vw;
    color: orange;
  }
`;

const List = styled.div`
  padding-top: 0.5vw;
  width: 92%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3vw;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 0.3vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #e5e5e5;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;

const ReviewItem = styled.div`
  width: 90%;
  margin-left: 5%;
  background: ${(props) => props.theme.categoryItem};
  border-radius: 2vw 0 2vw 2vw;
  padding: 0.25vw 1vw 0.5vw 1.5vw;
  box-sizing: border-box;
  margin-bottom: 0.3vw;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 0.1vw 0.2vw rgba(2, 2, 2, 0.1);
  gap: 5px;

  .arrowIcon {
    font-size: 1.5vw;
  }

  #text {
    color: ${(props) => props.theme.font};
  }
`;

const Reviewer = styled.span`
  font-weight: bold;
  margin-right: 5px;
  transition: ease 200ms;
  cursor: pointer;
  color: brown;
  font-size: 0.8vw;

  :hover {
    text-decoration: underline;
  }
`;
