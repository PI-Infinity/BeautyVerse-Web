import React from "react";
import styled from "styled-components";
import { IoMdArrowDropdown } from "react-icons/io";
import { BsCardChecklist } from "react-icons/bs";
import { TbArrowsSort, TbPercentage } from "react-icons/tb";
import { BiDollar } from "react-icons/bi";

export const MarketFilter = () => {
  const filterList = [
    {
      id: 1,
      active: "Brows",
      value: "Categories",
      icon: <BsCardChecklist className="icon" />,
      list: ["Make Up", "Hair", "Brows", "Nails", "Eyelashes"],
    },
    {
      id: 2,
      active: "Popular",
      value: "Sort By",
      icon: <TbArrowsSort className="icon" />,
      list: ["Popular", "Rating", "High Price", "Low Price", "Newest"],
    },
    {
      id: 3,
      active: "Brow Lamination",
      value: "Sub Categories",
      icon: <BsCardChecklist className="icon" />,
      list: [
        "Brow Lamination",
        "Brow Coloring",
        "Brow Lighting",
        "Brow Flexing",
        "Brow Care",
        "Brow Accessories",
      ],
    },
    {
      id: 4,
      active: "ELAN Professional Line",
      value: "Brands",
      icon: "",
      list: ["Tuya", "Kodi", "Brunson"],
    },
    {
      id: 5,
      active: "ELAN Georgia",
      value: "Shops",
      icon: "",
      list: ["ELAN Georgia", "VIP Beauty", "Womans Rai"],
    },
    {
      id: 6,
      value: "Price",
      icon: <BiDollar className="icon" />,
    },
    {
      id: 7,
      value: "Discount",
      icon: <TbPercentage className="icon" />,
      list: ["Up to 10%", "Up to 20%", "Up to 30%", "Up to 40%"],
    },
  ];
  const [openList, setOpenList] = React.useState("");
  return (
    <Container>
      {filterList?.map((item, index) => {
        return (
          <div
            key={item.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Category
              openList={openList}
              value={item.value}
              onClick={
                openList === item.value
                  ? () => setOpenList("")
                  : () => setOpenList(item.value)
              }
            >
              {item.icon}
              {item.value} <IoMdArrowDropdown className="arrowIcon" />
            </Category>
            {openList === item.value && <ListWindow items={item.list} />}
          </div>
        );
      })}
      {/* <SortBy>Sort By</SortBy>
      <SubCategory>Sub Category</SubCategory>
      <Brand>Brand</Brand>
      <Shop>Shop</Shop>
      <Price>Price</Price>
      <Discount>Discount</Discount> */}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 3vw;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  gap: 1vw;
  align-items: start;
  z-index: 1;
`;

const Category = styled.div`
  width: 10vw;
  padding: 0 1vw;
  height: 1.6vw;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  border-radius: 0.3vw;
  cursor: pointer;
  border: none;
  margin-top: 0.7vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8vw;
  gap: 10px;

  :focus {
    outline: none;
  }

  .icon {
    font-size: 1vw;
    color: #333;
    transition: ease 200ms;
  }
  .arrowIcon {
    font-size: 1vw;
    color: ${(props) => (props.openList === props.value ? "#333" : "#ccc")};
    transition: ease 300ms;
    transform: rotate(
      ${(props) => (props.openList === props.value ? "0" : "180deg")}
    );
  }
`;
const SortBy = styled.div``;
const SubCategory = styled.div``;
const Brand = styled.div``;
const Shop = styled.div``;
const Price = styled.div``;
const Discount = styled.div``;

/**
 * list view for filters
 */

const ListWindow = ({ items }) => {
  return (
    <ListContainer>
      {items?.map((item, index) => {
        return <ListItem key={index}>{item}</ListItem>;
      })}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  width: 9vw;
  height: auto;
  padding: 1vw;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  border-radius: 0.3vw;
  cursor: pointer;
  border: none;
  background: #fff;
  margin-top: 0.5vw;
  z-index: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  :focus {
    outline: none;
  }
`;

const ListItem = styled.div`
  padding: 0.25vw 0.5vw;

  :hover {
    background: #f3f3f3;
  }
`;
