import React from "react";
import styled from "styled-components";
import { Search } from "../../../src-marketplace/pages/market/search";
import { Brands } from "../../../src-marketplace/pages/market/market-brands";
import { MarketFilter } from "../../../src-marketplace/pages/market/market-filter";
import { ProductList } from "../../../src-marketplace/pages/market/market-list";
import { ShoppingCart } from "../../../src-marketplace/pages/market/market-cart";

const Market = () => {
  return (
    <MarketContainer>
      <TopSection>
        <Brands />
      </TopSection>
      <CenterSection>
        <MarketFilter />
        <ProductList />
      </CenterSection>
    </MarketContainer>
  );
};

export default Market;

const MarketContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  padding-bottom: 2.5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75vw;
  padding: 0.75vw 0;
  border-bottom: 1px solid #eee;
  z-index: 0;
`;

const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;
