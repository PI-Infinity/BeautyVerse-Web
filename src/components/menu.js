import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { CgMenuGridO, CgMenuGridR } from "react-icons/cg";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Badge from "@mui/material/Badge";
import {
  MdSecurity,
  MdAttachMoney,
  MdCircleNotifications,
} from "react-icons/md";
import { TbMessages } from "react-icons/tb";
import { FcAdvertising, FcRules, FcWorkflow } from "react-icons/fc";
import { BsQuestionLg } from "react-icons/bs";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Menu() {
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
    await dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

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

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 500 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
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
            <span>პირადი გვერდი</span>
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
        <Item
          onClick={async () => {
            // await mainDispatch(setOpenMobileMenu(false));
            // await mainDispatch(setOpenMenu("-25vw"));
            // navigate("/chat");
          }}
        >
          <Badge badgeContent={999} overlap="circular" color="secondary">
            <MdCircleNotifications className="icon" />{" "}
          </Badge>
          <span>შეტყობინებები</span>
        </Item>
        <Item
          onClick={async () => {
            navigate("/chat");
          }}
        >
          <Badge badgeContent={999} overlap="circular" color="secondary">
            <TbMessages className="icon" />
          </Badge>
          <span>ჩატი</span>
        </Item>
        {currentuser?.type != "user" && (
          <Item
            onClick={async () => {
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
          წესები და პირობები
        </Item>
        <Item
          onClick={async () => {
            navigate("/privacy");
          }}
        >
          <MdSecurity className="icon" />
          კონფიდენცი- ალურობა
        </Item>
        <Item
          onClick={async () => {
            navigate("/howwokrs");
          }}
        >
          <FcWorkflow className="icon" />
          როგორ მუშაობს?
        </Item>
        <Item
          onClick={async () => {
            navigate("/questions");
          }}
        >
          <BsQuestionLg className="icon" />
          კითხვებზე პასუხები
        </Item>
      </Items>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Button
          onClick={toggleDrawer("right", true)}
          style={{ color: "#05050" }}
        >
          <CgMenuGridO className="menuIcon" color="#222" />
        </Button>
        <Drawer
          anchor={"right"}
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          {list("right")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}

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
