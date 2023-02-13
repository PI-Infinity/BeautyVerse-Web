import React from "react";
import styled from "styled-components";
import {
  MdOutlineDynamicFeed,
  MdOutlinePersonPin,
  MdShoppingCart,
} from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { TbMessages } from "react-icons/tb";
import { FaUser } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import { BiMessageSquareAdd } from "react-icons/bi";
import { FiHome } from "react-icons/fi";
import { CgSearch } from "react-icons/cg";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase";
import {
  setFilterOpen,
  setChangeFeed,
  setLoadFeed,
  setNavigatorActive,
  setRerender,
  setScroll,
} from "../redux/main";
import { setFilter } from "../redux/marketplace/marketplace";
import { IsMobile } from "../functions/isMobile";
import Badge from "@mui/material/Badge";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

export const Navigator = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = auth.currentUser;
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

  return (
    <>
      <NavigatorContainer filterOpen={filterOpen}>
        <DynamicFeedIcon
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
        {user?.type === "user" ? (
          <CgSearch
            className={active == "add" ? "active" : "feedIcon"}
            onClick={async () => {
              await localStorage.setItem("BeautyVerse:scrollPosition", 0);
              await dispatch(setRerender());
              setTimeout(async () => {
                document.getElementById("search").focus();
              }, 500);
            }}
          />
        ) : (
          // <>
          //   {window.location.pathname?.startsWith("/marketplace") ? (
          //     <MdFilterList
          //       className="feedIcon"
          //       onClick={() => dispatch(setFilter(true))}
          //     />
          //   ) : (
          <MapsUgcIcon
            className={active == "add" ? "active" : "feedIcon"}
            onClick={() => {
              // dispatch(setNavigatorActive(2));
              navigate("add");
            }}
          />
          // )}
        )}
        <StyledBadge badgeContent={1} overlap="circular" color="secondary">
          <ForumOutlinedIcon
            className={active == "chat" ? "active" : "feedIcon"}
            onClick={() => {
              // dispatch(setNavigatorActive(3));
              navigate("chat");
            }}
          />
        </StyledBadge>
        <Link
          // onClick={() => dispatch(setNavigatorActive(4))}
          to={
            user?.type === "user"
              ? `user/${currentUser?.uid}/contact`
              : `user/${currentUser?.uid}`
          }
          style={{ color: "inherit", display: "flex", alignItems: "center" }}
        >
          <Profile active={active?.toString()}>
            {user?.cover == undefined ? (
              <UserProfileEmpty>
                <PersonOutlinedIcon className="user" />
              </UserProfileEmpty>
            ) : (
              <Img src={user?.cover} alt="cover" />
            )}
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
    padding: 0 3vw 0 2vw;
    border-top: 1px solid #f1f1f1;
    height: 11vw;
    overflow: hidden;
    position: fixed;
    justify-content: space-between;
    box-sizing: border-box;
    bottom: 0;
    align-items: start;
    z-index: 900;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(30px);
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

  .feedIcon {
    font-size: 1.1vw;
    color: #222;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 5.5vw;
      border-top: 2px solid rgba(0, 0, 0, 0);
      padding: 2vw 4vw;
      margin: 0;
    }
  }
  .active {
    font-size: 1.1vw;
    color: #2bdfd9;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 5.5vw;
      border-top: 2px solid #2bdfd9;
      padding: 2vw 4vw;
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
    width: 5vw;
    height: 5vw;
    margin: 2vw;
    padding: 0;
    border-radius: 50%;
    border: 2px solid
      ${(props) => (props.active === "user" ? "#2bdfd9" : "#222")};
  }

  :hover {
    filter: brightness(1);
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

const UserProfileEmpty = styled.div`
  width: 1.5vw;
  height: 1.5vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 3vw;
    height: 3vw;
  }

  .user {
    font-size: 1.2vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;
