import React from "react";
import styled from "styled-components";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { IsMobile } from "../../functions/isMobile";
import { useOutletContext, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import UserListDialogMain from "../../pages/user/userListPopup";

export const Audience = () => {
  const [user, language] = useOutletContext();
  const isMobile = IsMobile();
  const navigate = useNavigate();
  const { currentUser } = React.useContext(AuthContext);

  const [loading, setLoading] = React.useState(true);

  const [followers, setFollowers] = React.useState([]);
  const [followings, setFollowings] = React.useState([]);

  React.useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${user?.id}`, "followers"),
      (snapshot) => {
        setFollowers(snapshot.docs.map((doc) => doc.data()));
      }
    );
  }, []);
  React.useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${user?.id}`, "followings"),
      (snapshot) => {
        setFollowings(snapshot.docs.map((doc) => doc.data()));
      }
    );
  }, []);

  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <Content>
      {followers?.length < 1 && followings?.length < 1 ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ccc",
          }}
        >
          0 {language?.language.User.userPage.user}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {followers?.length > 0 && (
              <UserListDialogMain
                title={language?.language.User.userPage.followers}
                users={followers}
                type="followers"
                user={user}
                language={language}
              />
            )}
            <AvatarGroup total={followers?.length}>
              {followers?.map((item, index) => {
                return (
                  <Avatar
                    alt={item?.name}
                    src={item?.cover}
                    onClick={() => navigate(`/user/${item?.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </AvatarGroup>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {followings?.length > 0 && (
              <UserListDialogMain
                title={language?.language.User.userPage.followings}
                users={followings}
                type="followings"
                user={user}
                language={language}
              />
            )}
            <AvatarGroup total={followings?.length}>
              {followings?.map((item, index) => {
                return (
                  <Avatar
                    alt={item?.name}
                    src={item?.cover}
                    onClick={() => navigate(`/user/${item?.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </AvatarGroup>
          </div>
        </div>
      )}
    </Content>
  );
};

const Content = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 3vw;
  width: 100%;
  height: 100%;
  min-height: 50vh;
  flex-wrap: wrap;
  gap: 0.5vw;
  height: auto;
  margin-bottom: 5vw;
  overflow-x: hidden;

  .loadingIcon {
    font-size: 3vw;
  }

  @media only screen and (max-width: 600px) {
    justify-content: start;
    padding-top: 6vw;
    padding-left: 12vw;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding: 0.5vw;
  gap: 0.5vw;

  & span {
    @media only screen and (max-width: 600px) {
      margin: 3vw;
      font-size: 3.5vw;
      font-weight: normal;
      font-style: italic;
      color: ${(props) => props.theme.disabled};
    }
  }

  @media only screen and (max-width: 600px) {
    gap: 2vw;
  }
`;
