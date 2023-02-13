import React from "react";
import styled from "styled-components";
import { BsListCheck } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import {
  MdOutlinePhotoSizeSelectActual,
  MdContactPhone,
  MdShoppingCart,
} from "react-icons/md";
import { BsInfoLg } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { AiFillHeart, AiOutlineTeam } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { setContentChanger } from "../../redux/user";
import { IsMobile } from "../../functions/isMobile";

export const Navigator = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contentChanger = useSelector((state) => state.storeUser.contentChanger);
  const isMobile = IsMobile();

  const type = props?.type;

  const Contents = [
    {
      id: 1,
      value: "posts",
      title: "პოსტები",
      onClick: `/user/${props?.user.id}`,
      // className:
      //   window.location.pathname === `/user/${props?.user?.id}`
      //     ? "active"
      //     : "btn",
      icon: <MdOutlinePhotoSizeSelectActual className="icon" />,
    },
    {
      id: 2,
      value: "contact",
      title: "კონტაქტი",
      onClick: `contact`,
      // className:
      //   window.location.pathname === `/user/${props?.user?.id}/contact`
      //     ? "active"
      //     : "btn",
      id: "contact",
      icon: <MdContactPhone className="icon" />,
    },
    {
      id: 3,
      value: "team",
      title: "გუნდი",
      onClick: `team`,
      // className:
      //   window.location.pathname === `/user/${props?.user?.id}/team`
      //     ? "active"
      //     : "btn",
      id: "team",
      icon: <AiOutlineTeam className="icon" />,
    },
    {
      id: 4,
      value: type == "shop" ? "products" : "services",
      title: type == "shop" ? "პროდუქტები" : "სერვისები",
      onClick: `/user/${props?.user?.id}/services`,
      // className:
      //   window.location.pathname === `/user/${props?.user?.id}/services`
      //     ? "active"
      //     : "btn",
      icon:
        type == "shop" ? (
          <MdShoppingCart className="icon" />
        ) : (
          <BsListCheck className="icon" />
        ),
    },
    {
      id: 5,
      value: "audience",
      title: "აუდიტორია",
      onClick: `/user/${props?.user?.id}/audience`,
      // className:
      //   window.location.pathname === `/user/${props?.user?.id}/audience`
      //     ? "active"
      //     : "btn",
      icon: <FaUsers className="icon" />,
    },
  ];

  const list = Contents;

  /* 
  // DEFINE content categories
  */

  // change index positions for shop page
  // products goes to null position, posts goes to two position

  function array_move(arr, fromIndex, toIndex) {
    let a = arr;
    var element = a[fromIndex];
    a.splice(fromIndex, 1);
    a.splice(toIndex, 0, element);
    return a;
  }

  // mapping content categories

  const DefineList = () => {
    let content;
    if (type == "user") {
      content = list
        ?.filter((item, index) => {
          if (props?.userVisit) {
            return item?.value == "contact";
          } else {
            return item?.value == "followings" || item?.value == "contact";
          }
        })
        ?.map((item, index) => {
          return (
            <Link
              key={index}
              className={item?.className}
              to={item?.onClick}
              id={item?.id}
            >
              {item?.icon}
              {item?.title}
            </Link>
          );
        });
    } else if (type == "shop") {
      content = list
        ?.filter((item) => item.value !== "team")
        .map((item, index) => {
          return (
            <Link
              key={index}
              className={item?.className}
              to={item?.onClick}
              id={item?.id}
            >
              {item?.icon}
              {item?.title}
            </Link>
          );
        });
    } else if (type == "specialist") {
      content = list
        ?.filter((item) => item.value !== "team")
        ?.map((item, index) => {
          return (
            <Link
              key={index}
              className={item?.className}
              to={item?.onClick}
              id={item?.id}
            >
              {item?.icon}
              {item?.title}
            </Link>
          );
        });
    } else {
      content = list?.map((item, index) => {
        return (
          <Link
            key={item.id}
            className={item?.className}
            to={item?.onClick}
            id={item?.id}
          >
            {item?.icon}
            {item?.title}
          </Link>
        );
      });
    }
    return content;
  };

  const DefinedContet = DefineList();

  return <Container>{DefinedContet}</Container>;
};

const Container = styled.div`
  width: 97%;
  padding-left: 3%;
  height: 3.5vw;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  gap: 1vw;

  @media only screen and (max-width: 600px) {
    gap: 3vw;
    overflow-x: scroll;
    width: 100vw;
    height: 10vw;
    padding: 0 4vw;
    box-sizing: border-box;

    /* width */
    ::-webkit-scrollbar {
      width: 0vw;
      height: 0vw;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background-color: white;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background-color: #222;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background-color: #1e1e1e;
    }
  }

  #contact {
    display: none;
    @media only screen and (max-width: 600px) {
      display: flex;
    }
  }

  .active {
    border: 1px solid #e5e5e5;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 0.2vw;
    height: 1.8vw;
    padding: 0 0.5vw;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      height: 6vw;
      gap: 1.5vw;
      padding: 0 1.5vw;
      border-radius: 1vw;
    }

    :hover {
      filter: brightness(0.98);
    }

    .icon {
      font-size: 1vw;

      @media only screen and (max-width: 600px) {
        font-size: 4vw;
      }
    }
  }
`;

const Button = styled.div`
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 0.2vw;
  height: 1.8vw;
  padding: 0 0.5vw;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    height: 6vw;
    gap: 1.5vw;
    padding: 0 1.5vw;
    border-radius: 1vw;
    font-size: 3vw;
  }

  :hover {
    filter: brightness(0.98);
  }

  .icon {
    font-size: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
    }
  }
`;
