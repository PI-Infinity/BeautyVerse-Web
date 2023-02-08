import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Search } from "../../../src-marketplace/pages/market/search";
import { Filter } from "../../../src-marketplace/pages/market/filter";
import MarketplaceMain from "../../../src-marketplace/pages/market/marketplace-main";
import Market from "../../../src-marketplace/pages/market/market";
import { BsFilterSquareFill } from "react-icons/bs";
import { HiShoppingBag } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { setFilter } from "../../../redux/marketplace/marketplace";
import useWindowDimensions from "../../../functions/dimensions";

const Marketplace = () => {
  const { height, width } = useWindowDimensions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.storeMarket.filter);
  return (
    <Container>
      <TopSection>
        {filter && <Filter setFilter={setFilter} />}
        <BsFilterSquareFill
          className="filterIcon"
          onClick={() => dispatch(setFilter(true))}
        />
        <Search />
        <HiShoppingBag
          className="cartIcon"
          onClick={
            window.location.pathname?.startsWith("/marketplace/cart")
              ? () => navigate(-1)
              : () => navigate("/marketplace/cart")
          }
        />
      </TopSection>
      <CenterSection>
        <MainSection height={height}>
          <Outlet setFilter={setFilter} />
        </MainSection>
      </CenterSection>
    </Container>
  );
};

export default Marketplace;

const Container = styled.div`
  width: 100%;
  height: 95vh;
  overflow: hidden;
  box-sizing: border-box;
  padding-top: 3vw;
  padding-bottom: 5vw;
  display: flex;
  align-items: center;
  flex-direction: column;

  @media only screen and (max-width: 621px) {
    padding-top: calc(15vw - 1px);
    padding-bottom: 32vw;
  }
`;
const TopSection = styled.div`
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1vw 12.5vw;
  box-sizing: border-box;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  z-index: 100;

  @media only screen and (max-width: 621px) {
    justify-content: center;
    padding: 5px 4vw 10px 0vw;
    gap: 5px;
  }

  .filterIcon {
    font-size: 1.2vw;
    cursor: pointer;

    @media only screen and (max-width: 621px) {
      display: none;
    }
  }
  .cartIcon {
    font-size: 1.6vw;
    margin-right: 0.25vw;
    cursor: pointer;
    @media only screen and (max-width: 621px) {
      font-size: 5vw;
    }
  }
`;

const CenterSection = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 621px) {
  }
`;

const MainSection = styled.div`
  width: 100vw;
  height: calc(${(props) => props.height}px - 10vw);
  overflow-y: scroll;
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 621px) {
    padding-top: 0;
    padding-bottom: 5vw;
  }
`;
