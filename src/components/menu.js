import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { CgMenuGridO, CgMenuGridR } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Badge from "@mui/material/Badge";
import { MdSecurity, MdCircleNotifications } from "react-icons/md";
import { FcRules, FcWorkflow } from "react-icons/fc";
import { BsQuestionLg } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import Flag from "react-world-flags";
import {
  setOpenMobileMenu,
  setTheme,
  setUser,
  setLanguage,
} from "../redux/main";
import useWindowDimensions from "../functions/dimensions";
import { GiExitDoor } from "react-icons/gi";
import { IsMobile } from "../functions/isMobile";
import { makeStyles } from "@mui/styles";
import DarkModeToggle from "react-dark-mode-toggle";
import { Language } from "../context/language";

export default function Menu(props) {
  const { height, width } = useWindowDimensions();
  const language = Language();

  const Logout = async () => {
    await mainDispatch(setOpenMobileMenu(false));
    await dispatch({ type: "LOGOUT" });
    await mainDispatch(setUser(""));
    await localStorage.removeItem("BeautyVerse:user");
    navigate("/login");
  };

  const theme = useSelector((state) => state.storeMain.theme);

  const { currentUser } = useContext(AuthContext);
  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  const isMobile = IsMobile();

  const navigate = useNavigate();
  const mainDispatch = useDispatch();

  const { dispatch } = useContext(AuthContext);

  // define material menu state
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  /// define active btn
  const lang = useSelector((state) => state.storeMain.language);
  const [active, setActive] = React.useState();

  React.useEffect(() => {
    setActive(lang);
  }, [lang]);

  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === "top" || anchor === "bottom" ? "auto" : 500,
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Cont>
        <Items>
          <div
            onClick={
              currentUser != undefined
                ? async () => {
                    navigate(`/user/${currentUser?.uid}`);
                  }
                : async () => {
                    navigate("/login");
                  }
            }
            style={{
              color: "inherit",
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Item>
              <Profile>
                {currentuser?.cover === undefined ? (
                  <FaUser className="user" />
                ) : (
                  <Img src={currentuser?.cover} alt="cover" />
                )}
              </Profile>
              <span>{language?.language.Main.menu.profile}</span>
            </Item>
          </div>
          {/* <Item
            onClick={async () => {
              await mainDispatch(setOpenMobileMenu(false));
              await mainDispatch(setOpenMenu("-25vw"));
              navigate("/marketplace");
            }}
          >
            <RiShoppingCartFill className="icon" /> <span>მარკეტი</span>
          </Item> */}
          <Item onClick={() => props?.setOpen(true)}>
            <Badge
              badgeContent={props?.notifLength}
              overlap="circular"
              color="secondary"
            >
              <MdCircleNotifications className="icon" />{" "}
            </Badge>
            <span>{language?.language.Main.menu.notifications}</span>
          </Item>
          {/* <Item
          onClick={async () => {
            navigate("/chat");
          }}
        >
          <Badge badgeContent={999} overlap="circular" color="secondary">
            <TbMessages className="icon" />
          </Badge>
          <span>ჩატი</span>
        </Item> */}
          {/* {currentuser?.type != "user" && (
            <Item
              onClick={async () => {
                navigate("/advertisments");
              }}
            >
              <FcAdvertising className="icon" />
              რეკლამა
            </Item>
          )} */}
          {/* <Item>
            <GiShop className="icon" />
            მაღაზიის დამატება
          </Item> */}
          {/* <Item
            onClick={async () => {
              await mainDispatch(setOpenMobileMenu(false));
              await mainDispatch(setOpenMenu("-25vw"));
              navigate("/prices");
            }}
          >
            <MdAttachMoney className="icon" />
            ფასები
          </Item> */}
          <Item
            onClick={async () => {
              navigate("/rules");
            }}
          >
            <FcRules className="icon" />
            {language?.language.Main.menu.tr}
          </Item>
          <Item
            onClick={async () => {
              navigate("/privacy");
            }}
            style={{ flexDirection: "column" }}
          >
            <MdSecurity className="icon" />
            {language?.language.Main.menu.privacy?.split("", 9)}
            {!language?.language.Main.menu.privacy?.includes("Pr") && "."}
          </Item>
          <Item
            onClick={async () => {
              navigate("/howwokrs");
            }}
          >
            <FcWorkflow className="icon" />
            {language?.language.Main.menu.howitworks}
          </Item>
          <Item
            onClick={async () => {
              navigate("/questions");
            }}
          >
            <BsQuestionLg className="icon" />
            {language?.language.Main.menu.qa}
          </Item>
        </Items>

        <FooterContainer>
          <FooterContent>
            <Icons>
              <LanguageBg>
                <FaFacebook />
              </LanguageBg>
              <LanguageBg>
                <FaInstagram />
              </LanguageBg>
              <LanguageBg>
                <FaYoutube />
              </LanguageBg>
            </Icons>
            <div>
              <DarkModeToggle
                onChange={() => {
                  mainDispatch(setTheme(!theme));
                  localStorage.setItem(
                    "BeautyVerse:ThemeMode",
                    JSON.stringify(!theme)
                  );
                }}
                checked={theme}
                size={50}
              />
            </div>
            <Languages>
              <LanguageBg
                active={active === "ka" ? "true" : "false"}
                onClick={() => {
                  mainDispatch(setLanguage("ka"));
                  localStorage.setItem(
                    "BeautyVerse:Language",
                    JSON.stringify("ka")
                  );
                }}
              >
                <Flag code="geo" className="lang" />
              </LanguageBg>
              <LanguageBg
                active={active === "en" ? "true" : "false"}
                onClick={() => {
                  mainDispatch(setLanguage("en"));
                  localStorage.setItem(
                    "BeautyVerse:Language",
                    JSON.stringify("en")
                  );
                }}
              >
                <Flag code="usa" className="lang" />
              </LanguageBg>
              <LanguageBg
                active={active === "ru" ? "true" : "false"}
                onClick={() => {
                  mainDispatch(setLanguage("ru"));
                  localStorage.setItem(
                    "BeautyVerse:Language",
                    JSON.stringify("ru")
                  );
                }}
              >
                <Flag code="rus" className="langR" />
              </LanguageBg>
            </Languages>
          </FooterContent>
          {currentUser != undefined ? (
            <LogoutBtn onClick={Logout}>
              <GiExitDoor />
              {language?.language.Main.menu.logout}
            </LogoutBtn>
          ) : (
            <LogoutBtn
              onClick={async () => {
                navigate("/login");
              }}
            >
              <GiExitDoor />
              {language?.language.Main.menu.login}
            </LogoutBtn>
          )}
          {/* <Copyright>&#169; beautyverse</Copyright>{" "} */}
        </FooterContainer>
      </Cont>
    </Box>
  );

  const useStyles = makeStyles((theme) => ({
    root: {
      "& .MuiPaper-root": {
        borderRadius: "0.5vw 0 0 0.5vw",
        background: "none",
        boxShadow: "none",

        "@media only screen and (max-width: 1200px)": {
          borderRadius: "15px 15px 0 0",
          boxShadow: "0 -0.2vw 1vw rgba(0,0,0,0.2)",
        },
      },
    },
  }));

  const classes = useStyles();

  return (
    <Container>
      <React.Fragment>
        <Button
          onClick={
            isMobile
              ? toggleDrawer("bottom", true)
              : toggleDrawer("right", true)
          }
          sx={{
            width: "10px",
            padding: 0,
          }}
          className="menuIcon"
        >
          {state?.right || state?.bottom ? <CgMenuGridR /> : <CgMenuGridO />}
        </Button>
        <Drawer
          anchor={isMobile ? "bottom" : "right"}
          open={state[isMobile ? "bottom" : "right"]}
          className={classes.root}
          onClose={
            isMobile
              ? toggleDrawer("bottom", false)
              : toggleDrawer("right", false)
          }
        >
          {list(isMobile ? "bottom" : "right")}
        </Drawer>
      </React.Fragment>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  .menuIcon {
    color: ${(props) => props.theme.icon};
    @media only screen and (max-width: 1200px) {
      margin-left: 20px;
      font-size: 7vw;
    }
  }
`;

const Cont = styled.div`
  height: 100%;
  width: 100%;
  background: ${(props) => props.theme.background};
  margin-top: 0.2vw;
  border-radius: 0 0 0 0.5vw;
  @media only screen and (max-width: 1200px) {
    margin-top: 0;
  }
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  transition: ease-in-out 200ms;
  padding: 0.25vw;
  box-sizing: border-box;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    padding: 2vw 1vw;
    justify-items: center;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const Item = styled.div`
  box-shadow: 0 0.1vw 0.2vw ${(props) => props.theme.shadowColor};
  background: ${(props) => props.theme.categoryItem};
  color: ${(props) => props.theme.font};
  box-sizing: border-box;
  border-radius: 0.3vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1vw;
  width: 100%;
  height: 7vw;
  margin: 0.25vw;
  gap: 0.5vw;
  max-width: 8vw;
  font-size: 0.7vw;
  text-align: center;
  cursor: pointer;
  transition: ease 200ms;

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0.2vw 0.6vw rgba(2, 2, 2, 0.1);
    height: 30vw;
    padding: 3vw;
    width: 30vw;
    max-width: 30vw;
    margin: 1vw;
    font-size: 2.4vw;
    border-radius: 3vw;
    gap: 1.5vw;
  }

  :hover {
    box-shadow: inset 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
    background: ${(props) => props.theme.background};
  }

  .icon {
    font-size: 1.8vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }
  }
`;

const Profile = styled.div`
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  z-index: 7;
  margin-right: 0.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.9);
  transition: ease-in-out 200ms;

  @media only screen and (max-width: 600px) {
    width: 7vw;
    height: 7vw;
  }

  .user {
    border: 1px solid #ccc;
    padding: 0.2vw;
    border-radius: 50%;
    color: #ccc;
    font-size: 1.1vw;

    @media only screen and (max-width: 600px) {
      font-size: 4.5vw;
      padding: 0.6vw;
    }
  }

  :hover {
    filter: brightness(1);
  }
`;

const Img = styled.img`
  width: 2vw;
  height: 2vw;
  cursor: pointer;
  object-fit: cover;

  @media only screen and (max-width: 600px) {
    width: 7vw;
    height: 7vw;
  }
`;

const FooterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 3vw;
  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vw;
  }
`;

const FooterContent = styled.div`
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media only screen and (max-width: 600px) {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    // padding: 0 3vw;
    box-sizing: border-box;
    width: 100%;
  }
`;

const LanguageBg = styled.div`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px;
  border-radius: 100px;
  box-shadow: 0 0.1vw 0.2vw ${(props) => props.theme.shadowColor};
  background: ${(props) =>
    props.active === "true" ? props.theme.secondLevel : "none"};
  cursor: pointer;
`;

const Languages = styled.div`
  flex 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1vw;
  border-radius: 0.2vw;
  padding: 0.2vw 0.5vw;

  @media only screen and (max-width: 600px) {
    gap: 3vw;
    border-radius: 0.8vw;
    padding: 0.8vw 2vw;
    justify-content: center;
  }

  .lang {
    width: 1vw;
    height: 0.7vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      width: 4vw;
      height: 2.8vw;
    }
  }
  .langR {
    width: 1vw;
    height: 0.7vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      width: 4vw;
      height: 2.8vw;
      position: relative;
      bottom: 0.5vw;
    }
  }
`;
const Icons = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;
  font-size: 1vw;
  color: ${(props) => props.theme.icon};

  @media only screen and (max-width: 600px) {
    gap: 2vw;
    font-size: 4vw;
    justify-content: center;
  }
`;

const Copyright = styled.div`
  flex: 2,
  display: flex;
  justify-content: center;
  font-size: 1vw;

  @media only screen and (max-width: 600px) {
    font-size: 3.5vw;
    color: #ccc;
    letter-spacing: 0.2vw;
  }
`;

const LogoutBtn = styled.div`
  // box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 2.5vw;
  cursor: pointer;
  // background: #fff;
  transition: ease-in-out 200ms;
  color: ${(props) => props.theme.font};
  margin-top: 3vw;
  margin-bottom: 1vw;
  gap: 0.5vw;

  @media only screen and (max-width: 600px) {
    height: 10vh;
    gap: 1.5vw;
  }

  // :hover {
  //   background: #f7faff;
  // }
`;
