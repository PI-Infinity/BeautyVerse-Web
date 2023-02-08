import React from "react";
import styled from "styled-components";
import { BsListCheck } from "react-icons/bs";
import {
  MdOutlinePhotoSizeSelectActual,
  MdContactPhone,
  MdShoppingCart,
} from "react-icons/md";
import { BsInfoLg } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { setContentChanger } from "../../redux/user";

export const Navigator = (props) => {
  const dispatch = useDispatch();
  const contentChanger = useSelector((state) => state.storeUser.contentChanger);

  const type = props?.type;

  const Contents = [
    {
      value: "posts",
      title: "პოსტები",
      onClick: () => dispatch(setContentChanger("posts")),
      className: contentChanger == "posts" ? "active" : "btn",
      icon: <MdOutlinePhotoSizeSelectActual className="icon" />,
    },
    {
      value: "contact",
      title: "კონტაქტი",
      onClick: () => dispatch(setContentChanger("contact")),
      className: contentChanger == "contact" ? "active" : "btn",
      id: "contact",
      icon: <MdContactPhone className="icon" />,
    },
    {
      value: type == "shop" ? "products" : "services",
      title: type == "shop" ? "პროდუქტები" : "სერვისები",
      onClick:
        type == "shop"
          ? () => dispatch(setContentChanger("products"))
          : () => dispatch(setContentChanger("services")),
      className:
        contentChanger == "products" || contentChanger == "services"
          ? "active"
          : "btn",
      icon:
        type == "shop" ? (
          <MdShoppingCart className="icon" />
        ) : (
          <BsListCheck className="icon" />
        ),
    },
    {
      value: "followers",
      title: "ფოლოუერები",
      onClick: () => dispatch(setContentChanger("followers")),
      className: contentChanger == "followers" ? "active" : "btn",
      icon: <AiOutlineHeart className="icon" />,
    },
    {
      value: "followings",
      title: "ფავორიტები",
      onClick: () => dispatch(setContentChanger("followings")),
      className: contentChanger == "followings" ? "active" : "btn",
      icon: <AiFillHeart className="icon" />,
    },
  ];

  const contentsList = Contents;

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

  // define list
  let list;
  if (type == "shop" || type == "beautyCenter") {
    let changedFirst = array_move(Contents, 0, 2);
    list = array_move(changedFirst, 1, 0);
  } else {
    list = Contents;
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
            <Button
              key={index}
              className={item?.className}
              onClick={item?.onClick}
              id={item?.id}
            >
              {item?.icon}
              {item?.title}
            </Button>
          );
        });
    } else if (type == "shop") {
      content = list?.map((item, index) => {
        return (
          <Button
            key={index}
            className={item?.className}
            onClick={item?.onClick}
            id={item?.id}
          >
            {item?.icon}
            {item?.title}
          </Button>
        );
      });
    } else if (type == "specialist") {
      content = list?.map((item, index) => {
        return (
          <Button
            key={index}
            className={item?.className}
            onClick={item?.onClick}
            id={item?.id}
          >
            {item?.icon}
            {item?.title}
          </Button>
        );
      });
    } else {
      content = list?.map((item, index) => {
        return (
          <Button
            key={index}
            className={item?.className}
            onClick={item?.onClick}
            id={item?.id}
          >
            {item?.icon}
            {item?.title}
          </Button>
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
