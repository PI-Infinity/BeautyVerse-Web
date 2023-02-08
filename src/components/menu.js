import React, { useState, useContext } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { setOpenMenu, setRerender, setOpenMobileMenu } from "../redux/main";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GiExitDoor, GiShop } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { MdSecurity, MdAttachMoney } from "react-icons/md";
import { TbMessages } from "react-icons/tb";
import { RiShoppingCartFill } from "react-icons/ri";
import { FcAdvertising, FcRules, FcWorkflow } from "react-icons/fc";
import { BsQuestionLg } from "react-icons/bs";
import { Footer } from "../components/footer";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import Flag from "react-world-flags";
import useWindowDimensions from "../functions/dimensions";

export const Menu = (props) => {
  const { height, width } = useWindowDimensions();
  const { currentUser } = useContext(AuthContext);
  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  const openMenu = useSelector((state) => state.storeMain.openMenu);

  const navigate = useNavigate();
  const mainDispatch = useDispatch();

  const { dispatch } = useContext(AuthContext);

  const Logout = async () => {
    await mainDispatch(setOpenMenu("-25vw"));
    await mainDispatch(setOpenMobileMenu(false));
    await dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <Container desktop={props.desktop}>
      <Bg
        onClick={() => {
          mainDispatch(setOpenMenu(false));
        }}
        openMenu={openMenu}
      ></Bg>
      <MenuContainer openMenu={openMenu} height={height}>
        <Items>
          <div
            onClick={
              currentUser != undefined
                ? async () => {
                    await mainDispatch(setOpenMobileMenu(false));
                    await mainDispatch(setOpenMenu("-25vw"));
                    navigate("/user");
                  }
                : async () => {
                    await mainDispatch(setOpenMobileMenu(false));
                    await mainDispatch(setOpenMenu("-25vw"));
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
              <span>პირადი გვერდი</span>
            </Item>
          </div>
          <Item
            onClick={async () => {
              await mainDispatch(setOpenMobileMenu(false));
              await mainDispatch(setOpenMenu("-25vw"));
              navigate("/marketplace");
            }}
          >
            <RiShoppingCartFill className="icon" /> <span>მარკეტი</span>
          </Item>
          <Item
            onClick={async () => {
              await mainDispatch(setOpenMobileMenu(false));
              await mainDispatch(setOpenMenu("-25vw"));
              navigate("/chat");
            }}
          >
            <TbMessages className="icon" /> <span>ჩატი</span>
          </Item>
          {currentuser?.type != "user" && (
            <Item
              onClick={async () => {
                await mainDispatch(setOpenMobileMenu(false));
                await mainDispatch(setOpenMenu("-25vw"));
                navigate("/advertisments");
              }}
            >
              <FcAdvertising className="icon" />
              რეკლამა
            </Item>
          )}
          {/* <Item>
            <GiShop className="icon" />
            მაღაზიის დამატება
          </Item> */}
          <Item
            onClick={async () => {
              await mainDispatch(setOpenMobileMenu(false));
              await mainDispatch(setOpenMenu("-25vw"));
              navigate("/prices");
            }}
          >
            <MdAttachMoney className="icon" />
            ფასები
          </Item>
          <Item
            onClick={async () => {
              await mainDispatch(setOpenMobileMenu(false));
              await mainDispatch(setOpenMenu("-25vw"));
              navigate("/rules");
            }}
          >
            <FcRules className="icon" />
            წესები და პირობები
          </Item>
          <Item
            onClick={async () => {
              await mainDispatch(setOpenMobileMenu(false));
              await mainDispatch(setOpenMenu("-25vw"));
              navigate("/privacy");
            }}
          >
            <MdSecurity className="icon" />
            კონფიდენცი- ალურობა
          </Item>
          <Item
            onClick={async () => {
              await mainDispatch(setOpenMobileMenu(false));
              await mainDispatch(setOpenMenu("-25vw"));
              navigate("/howwokrs");
            }}
          >
            <FcWorkflow className="icon" />
            როგორ მუშაობს?
          </Item>
          <Item
            onClick={async () => {
              await mainDispatch(setOpenMobileMenu(false));
              await mainDispatch(setOpenMenu("-25vw"));
              navigate("/questions");
            }}
          >
            <BsQuestionLg className="icon" />
            კითხვებზე პასუხები
          </Item>
        </Items>

        <FooterContainer>
          <FooterContent>
            <Icons>
              <FaFacebook />
              <FaInstagram />
              <FaYoutube />
            </Icons>
            <Languages>
              <Flag code="geo" className="lang" />
              <Flag code="usa" className="lang" />
              <Flag code="rus" className="langR" />
            </Languages>
          </FooterContent>
          {currentUser != undefined ? (
            <LogoutBtn onClick={Logout}>
              <GiExitDoor />
              გასვლა
            </LogoutBtn>
          ) : (
            <LogoutBtn
              onClick={async () => {
                await mainDispatch(setOpenMobileMenu(false));
                await mainDispatch(setOpenMenu("-25vw"));
                navigate("/login");
              }}
            >
              <GiExitDoor />
              შესვლა
            </LogoutBtn>
          )}
          {/* <Copyright>&#169; beautyverse</Copyright>{" "} */}
        </FooterContainer>
      </MenuContainer>
    </Container>
  );
};

const Container = styled.div`
  @media only screen and (max-width: 600px) {
    display: ${(props) => props.desktop && "none"};
  }
`;

const Bg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: rgba(2, 2, 2, 0.5);
  transition: ease-in 150ms;
  display: ${(props) => (props.openMenu == "-25vw" ? "none" : "flex")};
  opacity: ${(props) => (props.openMenu == "-25vw" ? "0" : "1")};
  z-index: 1001;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const MenuContainer = styled.div`
  width: 26vw;
  height: 80vh;
  position: fixed;
  top: 3.7vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  border-radius: 0.5vw;
  right: 0;
  z-index: 1002;
  transition: ease-in-out 200ms;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(40px);
  // -webkit-animation: slide 0.2s forwards;
  // animation: slide 0.2s forwards;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: calc(${(props) => props.height}px - 15vw);
    top: 15vw;
    padding-top: 1vw;
    box-sizing: border-box;
    right: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
  }
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  transition: ease-in-out 200ms;
  padding: 0.25vw;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    padding: 2vw 1vw;
    justify-items: center;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const Item = styled.div`
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  box-sizing: border-box;
  border-radius: 0.3vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1vw;
  height: 7vw;
  margin: 0.25vw;
  gap: 0.5vw;
  max-width: 8vw;
  font-size: 0.7vw;
  text-align: center;
  cursor: pointer;
  background: #fff;
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
  }

  :hover {
    box-shadow: inset 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
    background: #f7faff;
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

  @media only screen and (max-width: 600px) {
    height: 10vh;
  }

  :hover {
    background: #f7faff;
  }
`;

const FooterContainer = styled.div`
  // display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2vw;
  }
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  // padding: 0 3vw;
  box-sizing: border-box;
  width: 100%;
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
  color: #222;

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
