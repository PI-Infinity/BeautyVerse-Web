import React, { useContext } from "react";
import styled from "styled-components";
import { AiOutlineComment } from "react-icons/ai";
import { MdOutlineArrowRight } from "react-icons/md";
import { RiUserHeartFill } from "react-icons/ri";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { useSelector, useDispatch } from "react-redux";
import { setTargetUser } from "../../redux/chat";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  collectionGroup,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";

export const Reviews = () => {
  const { currentUser } = useContext(AuthContext);
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
        ბოლო შეფასებები <AiOutlineComment className="likedIcon" />
      </Title>
      <List>
        {reviewList
          ?.sort((a, b) => b?.time?.seconds - a?.time?.seconds)
          ?.map((item, index) => {
            let currentPostTime = new Date(item?.time?.seconds * 1000)
              .toString()
              .slice(4, 24);
            return (
              <div key={index}>
                <div
                  style={{
                    width: "92%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    style={{
                      color: "#ddd",
                      fontSize: "0.7vw",
                      // fontWeight: "bold",
                      fontStyle: "italic",
                      marginLeft: "1vw",
                    }}
                  >
                    {currentPostTime}
                  </span>
                </div>
                <ReviewItem>
                  <Reviewer
                    onClick={() => navigate(`/user/${item?.reviewerId}`)}
                  >
                    {item.reviewer}:
                  </Reviewer>
                  <span>{item.text}</span>{" "}
                  <MdOutlineArrowRight className="arrowIcon" />
                  <Reviewer
                    onClick={() => navigate(`/user/${item?.reviewerId}`)}
                    style={{ color: "#46BCFF" }}
                  >
                    {item.reciever}
                  </Reviewer>
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
  border-bottom: 1px solid #ddd;
  background: rgba(255, 255, 255, 0.2);
`;

const Title = styled.div`
  width: 100%;
  color: ${(props) => props.theme.mainFont};
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
  padding-top: 1vw;
  width: 92%;
  display: flex;
  flex-direction: column;
  align-items: start;
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
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2vw 2vw 2vw 0;
  padding: 0.5vw 1vw 0.5vw 1.5vw;
  box-sizing: border-box;
  margin-bottom: 0.3vw;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 0.1vw 0.2vw rgba(2, 2, 2, 0.1);

  .arrowIcon {
    font-size: 1.5vw;
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
