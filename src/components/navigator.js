import React, { useContext } from "react";
import styled from "styled-components";
import { GiFlexibleStar } from "react-icons/gi";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { setLoadFeed, setRerender } from "../redux/main";
import { IsMobile } from "../functions/isMobile";
import Badge from "@mui/material/Badge";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Avatar from "../components/avatar";

export const Navigator = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useContext(AuthContext);
  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);

  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

  // open mobile filter
  const filterOpen = useSelector((state) => state.storeMain.mobileFilter);

  // hide filter on scroll
  const scroll = useSelector((state) => state.storeMain.scroll);

  // define mobile or desktop

  const isMobile = IsMobile();

  let active;
  if (window.location.pathname == "/") {
    active = "main";
  } else if (window.location.pathname == "/cards") {
    active = "cards";
  } else if (window.location.pathname == "/add") {
    active = "add";
  } else if (window.location.pathname == "/chat") {
    active = "chat";
  } else if (window.location.pathname == "/recomended") {
    active = "recomended";
  } else if (window.location.pathname?.startsWith(`/user/${user?.id}`)) {
    active = "user";
  } else {
    active = "main/user";
  }

  // referal of feeds wrapper div element to scrolling flexible
  const refDiv = document.getElementById("feed");

  //market filter
  const filter = useSelector((state) => state.storeMarket.filter);

  // style chat badge

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 15,
      top: 15,
      border: `2px solid #fff`,
      padding: "0 4px",
    },
  }));

  // define unread messages length
  const [chats, setChats] = React.useState("");

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
      <NavigatorContainer
        filterOpen={filterOpen}
        recomended={active === "recomended" ? "true" : "false"}
      >
        <DynamicFeedIcon
          style={{ fontSize: "6vw" }}
          className={
            active === "main" || active === "main/user" ? "active" : "feedIcon"
          }
          onClick={
            active === "main"
              ? () => {
                  localStorage.setItem("BeautyVerse:scrollPosition", 0);
                  dispatch(setRerender());
                }
              : async () => {
                  // await dispatch(setNavigatorActive(0));
                  localStorage.setItem("BeautyVerse:scrollPosition", 0);
                  navigate("/");
                  await dispatch(setLoadFeed(true));
                  // await dispatch(setChangeFeed(true));
                  await dispatch(setRerender());
                }
          }
        />
        <SwitchAccountIcon
          className={active == "cards" ? "active" : "feedIcon"}
          onClick={() => {
            dispatch(setRerender());
            navigate("cards");
          }}
        />
        {/* <Market>
          <ButtonBg>
            <MarketButton
              onClick={() => {
                dispatch(setNavigatorActive(1));
                navigate("/marketplace");
              }}
            >
              <MdShoppingCart className={active == 1 ? "active" : "feedIcon"} />
            </MarketButton>
          </ButtonBg>
        </Market> */}

        <GiFlexibleStar
          className={active == "recomended" ? "active" : "feedIcon"}
          style={{ color: "#f2cd38" }}
          onClick={() => {
            // dispatch(setNavigatorActive(2));
            navigate("recomended");
          }}
        />

        {chats > 0 ? (
          <StyledBadge
            badgeContent={chats}
            overlap="circular"
            color="secondary"
          >
            <ForumOutlinedIcon
              className={active == "chat" ? "active" : "feedIcon"}
              onClick={() => {
                // dispatch(setNavigatorActive(3));
                navigate("chat");
              }}
            />
          </StyledBadge>
        ) : (
          <ForumOutlinedIcon
            className={active == "chat" ? "active" : "feedIcon"}
            onClick={() => {
              // dispatch(setNavigatorActive(3));
              navigate("chat");
            }}
          />
        )}
        <Link
          // onClick={() => dispatch(setNavigatorActive(4))}
          to={(() => {
            if (currentUser === null) {
              return "/login";
            } else if (user?.type === "user") {
              return `user/${currentUser?.uid}/contact`;
            } else {
              return `user/${currentUser?.uid}`;
            }
          })()}
          style={{
            color: "inherit",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Profile active={active?.toString()}>
            <Avatar
              alt={user?.name}
              link={user?.cover !== undefined ? user?.cover : ""}
              size="small"
            />
          </Profile>
        </Link>
      </NavigatorContainer>
    </>
  );
};

const NavigatorContainer = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    width: 100vw;
    padding: 0 4vw 0 3vw;
    border-top: 1px solid ${(props) => props.theme.secondLevel};
    height: 11vw;
    overflow: hidden;
    position: fixed;
    justify-content: space-between;
    box-sizing: border-box;
    bottom: 0;
    align-items: center;
    z-index: 90;
    background: ${(props) => props.theme.background};
  }

  .filter {
    display: none;
    @media only screen and (max-width: 600px) {
      display: flex;
      font-size: 6vw;
      cursor: pointer;
      margin-right: 1vw;
      color: ${(props) => props.theme.secondLevel};

      color: linear-gradient(
        0deg,
        rgba(32, 218, 169, 1) 0%,
        rgba(196, 16, 215, 1) 50%,
        rgba(0, 212, 255, 1) 100%
      );
      transition: ease 200ms;
    }
  }

  .listIcon {
    font-size: 1.1vw;
    color: linear-gradient(90deg, red, green);
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 5.5vw;
      border-top: 2px solid rgba(0, 0, 0, 0);
      padding: 2vw;
      margin: 0;
    }
  }
  .feedIcon {
    font-size: 1.1vw;
    color: ${(props) => props.theme.icon};
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 5.5vw;
      border-top: 2px solid rgba(0, 0, 0, 0);
      padding: 2vw;
      margin: 0;
    }
  }
  .active {
    font-size: 1.1vw;
    color: #2bdfd9;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 5.5vw;
      border-top: 2px solid
        ${(props) => (props.recomended === "true" ? "#f2cd38" : "#2bdfd9")};
      padding: 2vw;
      margin: 0;
    }
  }

  .productIcon {
    @media only screen and (max-width: 600px) {
      font-size: 5vw;
      color: #ccc;
      margin-right: 3vw;
      cursor: pointer;
    }
  }
`;

const Changer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.3vw;
  padding: 1vw;
  flex: 1;

  @media only screen and (max-width: 600px) {
    height: 10vw;
    gap: 0.3vw;
  }
`;

const Market = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    align-items: center;
  }
`;

const MarketButton = styled.div`
  padding: 0.55vw 1.5vw 0.55vw 1.5vw;
  border-radius: 0.5vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1vw;
  color: white;
  font-size: 3.5vw;
  font-weight: bold;
  cursor: pointer;
  color: ${(props) => props.theme.secondLevel};
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    padding: 0;
    gap: 0;
  }
`;

const ButtonBg = styled.div`
  box-sizing: border-box;
  padding: 0.7vw 0.7vw 0.7vw 0.8vw;
  border-radius: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  @media only screen and (max-width: 600px) {
    padding: 0;
  }

  // background: linear-gradient(323deg, #438ee4, #c743e4, #e4b643, #43e457);
  background: none;
  background-size: 800% 800%;

  -webkit-animation: AnimationName 5s ease infinite;
  -moz-animation: AnimationName 5s ease infinite;
  animation: AnimationName 5s ease infinite;

  @-webkit-keyframes AnimationName {
    0% {
      background-position: 7% 0%;
    }
    50% {
      background-position: 94% 100%;
    }
    100% {
      background-position: 7% 0%;
    }
  }
  @-moz-keyframes AnimationName {
    0% {
      background-position: 7% 0%;
    }
    50% {
      background-position: 94% 100%;
    }
    100% {
      background-position: 7% 0%;
    }
  }
  @keyframes AnimationName {
    0% {
      background-position: 7% 0%;
    }
    50% {
      background-position: 94% 100%;
    }
    100% {
      background-position: 7% 0%;
    }
  }
`;

const Profile = styled.div`
  width: auto;
  height: auto;
  border-radius: 50%;

  @media only screen and (max-width: 600px) {
    border: 2px solid
      ${(props) => (props.active === "user" ? "#2bdfd9" : props.theme.font)};
  }

  :hover {
    filter: brightness(1);
  }
`;
