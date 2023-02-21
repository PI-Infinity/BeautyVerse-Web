import React, { useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import { AiOutlineComment } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { onSnapshot, collectionGroup } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";

export default function Notifications() {
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
    <>
      <Title>
        ბოლო შეფასებები <AiOutlineComment className="likedIcon" />
      </Title>
      <List
        sx={{
          width: "90%",
          bgcolor: "background.paper",
          pl: 5,
          pt: 1,
          height: 300,
          overflowY: "scroll",
        }}
      >
        {reviewList
          ?.sort((a, b) => b?.time?.seconds - a?.time?.seconds)
          ?.map((item, index) => {
            let currentPostTime = new Date(item?.time?.seconds * 1000)
              .toString()
              .slice(4, 24);
            return (
              <>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => navigate("/chat")}
                  style={{ cursor: "pointer" }}
                >
                  <ListItemAvatar>
                    <Avatar alt="Remy Sharp" src={item?.reviewerCover} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item?.reviewer}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {item.reciever}
                        </Typography>
                        {" - "}
                        {item.text}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </>
            );
          })}
      </List>
    </>
  );
}

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
