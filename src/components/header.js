import React, { useContext } from "react";
import styled from "styled-components";
import { MdCircleNotifications, MdPersonPin } from "react-icons/md";
import { BiMessageSquareAdd } from "react-icons/bi";
import { CgMenuGridO, CgMenuGridR } from "react-icons/cg";
import { BsStars, BsLayoutTextSidebarReverse } from "react-icons/bs";
import { setOpenMenu, setOpenMobileMenu } from "../redux/main";
import Menu from "../components/menu";
import { MobileMenu } from "../components/mobileMenu";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaUser } from "react-icons/fa";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { TbMessages } from "react-icons/tb";
import { auth } from "../firebase";
import { RiShoppingCartFill } from "react-icons/ri";
import marketIcon from "../assets/market.png";
import { Filter } from "../pages/main/filter";
import Badge from "@mui/material/Badge";
import { IsMobile } from "../functions/isMobile";

export const Header = () => {
  const isMobile = IsMobile();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cover = useSelector((state) => state.storeMain.cover);
  const rerender = useSelector((state) => state.storeMain.rerender);
  const openMenu = useSelector((state) => state.storeMain.openMenu);
  const openMobileMenu = useSelector((state) => state.storeMain.openMobileMenu);

  const currentUser = auth.currentUser;

  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);

  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }
  // import current shop from redux state
  const shopUnparsed = useSelector((state) => state.storeMarket.shop);

  let shop;
  if (shopUnparsed?.length > 0) {
    shop = JSON.parse(shopUnparsed);
  }

  const MenuOpening = () => {
    if (isMobile) {
      dispatch(setOpenMobileMenu(true));
    } else {
      dispatch(setOpenMenu("0.5vw"));
    }
  };

  // define scroll
  const scroll = useSelector((state) => state.storeScroll.scroll);

  return (
    <>
      {openMobileMenu && <MobileMenu />}
      <Container scroll={scroll}>
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
            <Title2 style={{ color: "#333" }}>verse</Title2>
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
              <Badge badgeContent={5} color="secondary">
                <TbMessages
                  className="notifIcon"
                  size={24}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/chat")}
                />
              </Badge>
            </div>
          )}
          <Link
            to={`/user/${currentUser?.uid}`}
            style={{ color: "inherit", display: "flex", alignItems: "center" }}
          >
            <Profile>
              {user?.cover == undefined ? (
                <FaUser className="user" />
              ) : (
                <Img src={user?.cover} alt="cover" />
              )}
            </Profile>
          </Link>

          {isMobile ? (
            <>
              {!openMobileMenu ? (
                <Badge badgeContent={999} overlap="circular" color="secondary">
                  <CgMenuGridO className="menuIcon" onClick={MenuOpening} />
                </Badge>
              ) : (
                <Badge badgeContent={999} overlap="circular" color="secondary">
                  <CgMenuGridR
                    className="ClosemenuIcon"
                    onClick={() => {
                      dispatch(setOpenMobileMenu(false));
                    }}
                  />
                </Badge>
              )}
            </>
          ) : (
            <Menu />
          )}
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
  border-bottom: 1px solid #ddd;
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
    padding: 0 3vw 0.6vw 3vw;
    background: ${(props) =>
      props.scroll ? "white" : "rgba(255, 255, 255, 0.9)"};
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
    margin-right: 0.25vw;
    // color: #c743e4;

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

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }
  }
  .menuIcon {
    margin-left: 0.5vw;
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

  background: -webkit-linear-gradient(90deg, #222, #111, #111, #222);
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
  color: #333;

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
