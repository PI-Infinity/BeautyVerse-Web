import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { BiMessageSquareAdd } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { setOpenMenu, setOpenMobileMenu } from "../redux/main";
import Menu from "../components/menu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TbMessages } from "react-icons/tb";
import Badge from "@mui/material/Badge";
import { IsMobile } from "../functions/isMobile";
import { AuthContext } from "../context/AuthContext";
import Avatar from "@mui/material/Avatar";
import {
  query,
  limit,
  orderBy,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import Notifications from "../components/notifications";

export const Header = () => {
  const isMobile = IsMobile();
  const { currentUser } = useContext(AuthContext);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cover = useSelector((state) => state.storeMain.cover);
  const rerender = useSelector((state) => state.storeMain.rerender);
  const openMenu = useSelector((state) => state.storeMain.openMenu);
  const openMobileMenu = useSelector((state) => state.storeMain.openMobileMenu);

  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);

  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

  // import current shop from redux state
  // const shopUnparsed = useSelector((state) => state.storeMarket.shop);

  // let shop;
  // if (shopUnparsed?.length > 0) {
  //   shop = JSON.parse(shopUnparsed);
  // }

  const MenuOpening = () => {
    if (isMobile) {
      dispatch(setOpenMobileMenu(true));
    } else {
      dispatch(setOpenMenu("0.5vw"));
    }
  };

  // define scroll
  const scroll = useSelector((state) => state.storeScroll.scroll);

  // styled badge for menu

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 20,
      top: 5,
      padding: "0",
    },
  }));

  // get notificationst
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const ref = query(
      collection(db, "users", `${currentUser?.uid}`, "notifications"),
      orderBy("date", "desc"),
      limit(50)
    );
    onSnapshot(ref, (snapshot) => {
      setNotifications(snapshot.docs.map((doc) => doc.data()));
    });
  }, [currentUser]);

  const notifLength = notifications?.filter(
    (item) => item?.status === "unread"
  );
  // open notifs
  const [openNotifications, setOpenNotifications] = useState(false);

  // define unread messages length
  const [chats, setChats] = React.useState([]);

  React.useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        collection(db, "users", currentUser?.uid, "chats"),
        (snapshot) => {
          let result = snapshot.docs.map((doc) => doc.data());
          const filtered = result?.filter(
            (item) =>
              item?.opened === false && item?.senderId !== currentUser?.uid
          );
          setChats(filtered?.length);
        }
      );
      return () => {
        unsub();
      };
    };
    currentUser?.uid && getChats();
  }, [currentUser]);

  return (
    <>
      <Notifications
        open={openNotifications}
        setOpen={setOpenNotifications}
        notifications={notifications}
      />
      <Container scroll={scroll} isMobile={isMobile}>
        <Divider style={{ justifyContent: "start", flex: 2 }} empty={true}>
          <BsStars className="logo" onClick={() => navigate("/")} />
        </Divider>
        <Divider>
          <div
            onClick={
              window.location.pathname != "/"
                ? () => {
                    navigate("/");
                    localStorage.setItem("BeautyVerse:scrollPosition", 0);
                  }
                : () => {
                    localStorage.setItem("BeautyVerse:scrollPosition", 0);
                    window.location.reload();
                  }
            }
            className="logoLink"
          >
            <Title>Beauty</Title>
            <Title2>verse</Title2>
          </div>
        </Divider>
        <Divider style={{ justifyContent: "flex-end", alignItems: "center" }}>
          {!isMobile && user !== undefined && (
            <div
              style={{
                marginRight: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                height: "100%",
                marginTop: "3px",
              }}
            >
              {user?.type !== "user" && (
                <BiMessageSquareAdd
                  className="notifIcon"
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/add")}
                />
              )}
              {chats > 0 ? (
                <Badge badgeContent={chats} color="secondary">
                  <TbMessages
                    className="notifIcon"
                    size={24}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/chat")}
                  />
                </Badge>
              ) : (
                <TbMessages
                  className="notifIcon"
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/chat")}
                />
              )}
            </div>
          )}
          {currentUser !== null ? (
            <Link
              to={`/user/${currentUser?.uid}`}
              style={{
                color: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Profile>
                <Avatar
                  alt={user?.name}
                  src={user?.cover !== undefined ? user?.cover : ""}
                  sx={{ width: 36, height: 36 }}
                />
              </Profile>
            </Link>
          ) : (
            <Link
              to={"/login"}
              style={{
                color: "inherit",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Profile>
                <Avatar
                  alt={user?.name}
                  src={user?.cover !== undefined ? user?.cover : ""}
                  sx={{ width: 36, height: 36 }}
                />
              </Profile>
            </Link>
          )}

          {notifLength?.length > 0 ? (
            <StyledBadge
              badgeContent={notifLength?.length}
              overlap="circular"
              color="secondary"
            >
              <Menu
                notifLength={notifLength?.length}
                open={openNotifications}
                setOpen={setOpenNotifications}
              />
            </StyledBadge>
          ) : (
            <Menu
              notifLength={notifLength?.length}
              open={openNotifications}
              setOpen={setOpenNotifications}
            />
          )}
          {/* )} */}
        </Divider>
      </Container>
    </>
  );
};

const Container = styled.div`
  position: fixed;
  background: ${(props) => props.theme.background};
  height: 3vw;
  top: 0.2vw;
  left: 0;
  right: 0;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2vw 0.2vw 2vw;
  z-index: 1000;
  overflow: hidden;
  box-sizing: border-box;

  .logoLink {
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    position: absolute;
    top: 1vw;
    height: 14vw;
    border-bottom: 0px solid #ddd;
    padding: 0 0 0.6vw 0;
    backdrop-filter: blur(30px);
    box-sizing: border-box;
  }
`;

const Divider = styled.div`
  flex: 2;
  display: ${(props) => (props.empty ? "none" : "flex")};
  align-items: center;

  .logo {
    font-size: 1.7vw;
    margin-left: 3vw;
    color: ${(props) => props.theme.logo};

    @media only screen and (max-width: 600px) {
      font-size: 6.5vw;
      margin-right: 1vw;
    }
  }
  @media only screen and (max-width: 600px) {
    display: flex;
  }

  .chatIcon {
    font-size: 1.4vw;
    margin-right: 0.7vw;
    margin-top: 0.2vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      margin-right: 3vw;
    }
  }

  .userIcon {
    font-size: 1.6vw;
    margin-right: 0.3vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      margin-right: 1vw;
    }
  }
  .notifIcon {
    font-size: 1.7vw;
    color: ${(props) => props.theme.icon};

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }
  }
  .menuIcon {
    // margin-left: 0.5vw;
    font-size: 1.7vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 7vw;
      margin: 0;
    }
  }
  .ClosemenuIcon {
    margin-left: 0.5vw;
    font-size: 1.7vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 7vw;
      margin: 0;
    }
  }
`;

const Title = styled.span`
  font-size: 1.5vw;
  font-weight: bold;
  padding: 0;
  background: ${(props) => props.theme.logo};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media only screen and (max-width: 600px) {
    font-size: 6vw;
    letter-spacing: 0.1vw;
    position: relative;
    bottom: 0.2vw;
    padding: 0;
    margin: 0;
  }
`;
const Title2 = styled.span`
  font-size: 1.5vw;
  color: ${(props) => props.theme.logo2};

  @media only screen and (max-width: 600px) {
    font-size: 6vw;
    letter-spacing: 0.1vw;
    position: relative;
    bottom: 0.2vw;
  }
`;

const Profile = styled.div`
  width: 1.6vw;
  height: 1.6vw;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  z-index: 7;
  margin-right: 0.5vw;
  margin-top: 0.1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.9);
  transition: ease-in-out 200ms;

  animation: fadeIn 0.5s;
  -webkit-animation: fadeIn 0.5s;
  -moz-animation: fadeIn 0.5s;
  -o-animation: fadeIn 0.5s;
  -ms-animation: fadeIn 0.5s;

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
    display: none;
  }

  .user {
    border: 1px solid #ccc;
    padding: 0.2vw;
    border-radius: 50%;
    color: #ccc;
    font-size: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
      border: 2px solid #ccc;
      padding: 0.6vw;
    }
  }
`;

const Img = styled.img`
  width: 1.8vw;
  height: 1.8vw;
  cursor: pointer;
  object-fit: cover;

  @media only screen and (max-width: 600px) {
    width: 7vw;
    height: 7vw;
  }
`;
