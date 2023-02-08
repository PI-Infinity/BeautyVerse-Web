import React, { useState } from "react";
import styled from "styled-components";
import { ShopCategories } from "../../../data/categories";
import { useSelector, useDispatch } from "react-redux";
import { AiFillFastBackward } from "react-icons/ai";
import { setFilter } from "../../../redux/marketplace/marketplace";

export const Filter = ({ setFilter }) => {
  const dispatch = useDispatch();
  const [subCategories, setSubCategories] = useState(false);
  const [subItems, setSubItems] = useState([]);
  const filter = useSelector((state) => state.storeMarket.filter);

  const DefineSubs = (x) => {
    setSubCategories(true);
    setSubItems(x);
  };

  return (
    <Container>
      <Bg onClick={() => dispatch(setFilter(false))} />
      <FilterContainer>
        {ShopCategories?.map((item, index) => {
          return (
            <CategoryItem
              key={item.id}
              onMouseEnter={() => DefineSubs(item.geo)}
            >
              {item.title}
            </CategoryItem>
          );
        })}
        <div>
          <AiFillFastBackward onClick={() => dispatch(setFilter(false))} />
        </div>
      </FilterContainer>
      {subCategories && <SubContainer>{subItems}</SubContainer>}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10007;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const Bg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.15);
  cursor: pointer;
`;

const FilterContainer = styled.div`
  position: absolute;
  left: -20%;
  z-index: 10009;
  margin-top: 0.2vw;
  height: 100%;
  width: 20%;
  background: #fff;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.2);
  -webkit-animation: slide 0.2s forwards;
  animation: slide 0.2s forwards;
  box-sizing: border-box;
  padding: 2vw;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media only screen and (max-width: 621px) {
    margin-top: 1vw;
    width: 100vw;

    @-webkit-keyframes slide {
      100% {
        left: 0;
      }
    }

    @keyframes slide {
      100% {
        left: 0;
      }
    }
  }

  @-webkit-keyframes slide {
    100% {
      left: 0;
    }
  }

  @keyframes slide {
    100% {
      left: 0;
    }
  }
`;

const CategoryItem = styled.div`
  cursor: pointer;
  width: 50%;
  display: flex;
  background: yellow;
`;

const SubContainer = styled.div`
  position: absolute;
  left: 20%;
  z-index: 10008;
  margin-top: 0.2vw;
  height: 100%;
  width: 20%;
  background: #f3f3f3;
  // -webkit-animation: slide 0.5s forwards;
  // animation: slide 0.5s forwards;
  box-sizing: border-box;
  padding: 2vw;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @-webkit-keyframes slide {
    100% {
      left: 0%;
    }
  }

  @keyframes slide {
    100% {
      left: 0%;
    }
  }
`;
