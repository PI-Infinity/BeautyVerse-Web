import React from "react";
import styled from "styled-components";
import { ShopCategories } from "../../../data/categories";
import { ProductList } from "../../../src-marketplace/pages/market/productList";
import { useNavigate } from "react-router-dom";
import { IsMobile } from "../../../functions/isMobile";
import { BsFilterSquareFill } from "react-icons/bs";
import { HiShoppingBag } from "react-icons/hi";

const MarketplaceMain = (props) => {
  const isMobile = IsMobile();
  const navigate = useNavigate();
  return (
    <Container>
      <h3>Marketplace</h3>
      <CoverSlider>
        <CoverImgContainer>
          <CoverImg
            src="https://res.cloudinary.com/mimino/image/upload/v1673281337/ELAN/products/brow-liner-pro-2-900x900-min_ckbqxc.jpg"
            onClick={() => navigate("/marketplace/market")}
          />
        </CoverImgContainer>
      </CoverSlider>
      <h4>Categories</h4>
      <Categories>
        {ShopCategories?.map((item, index) => {
          return (
            <Category key={index}>
              <CategoryImg
                src={item.url}
                alt={item.title}
                onClick={() => navigate(`/marketplace/market/${item.title}`)}
              />
            </Category>
          );
        })}
      </Categories>
      <h4>Best Seller Products</h4>
      <ProductList />
      <h4>Advertisments</h4>
      <AdsCards>
        <AddCard>
          <AddCardImg
            src="https://res.cloudinary.com/mimino/image/upload/v1673338805/ELAN/products/skin-pro-concealer-1-900x900-min_g6mcfu.jpg"
            alt="ads"
          />
        </AddCard>
        <AddCard>
          <AddCardImg
            src="https://res.cloudinary.com/mimino/image/upload/v1673281471/ELAN/products/smart-skin-colour-remover-1-900x900-min_a0oruf.jpg"
            alt="ads"
          />
        </AddCard>
      </AdsCards>
      <h4>Last Solds</h4>
      <ProductList />
    </Container>
  );
};

export default MarketplaceMain;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  @media only screen and (max-width: 621px) {
    align-items: center;
  }

  & > h3 {
    @media only screen and (max-width: 621px) {
      margin: 3vw;
      letter-spacing: 0.2vw;
    }
  }

  & > h4 {
    @media only screen and (max-width: 621px) {
      margin: 3vw;
    }
  }
`;

const CoverSlider = styled.div`
  width: 75vw;
  height: 20vw;
  border-radius: 1vw;
  padding: 1vw;
  box-sizing: border-box;
  background: #f3f3f3;

  @media only screen and (max-width: 621px) {
    width: 95vw;
    height: 60vw;
    padding: 3vw;
  }
`;

const CoverImgContainer = styled.div`
  width: 73vw;
  height: 18vw;
  border-radius: 1vw;
  overflow: hidden;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);

  @media only screen and (max-width: 621px) {
    width: 89vw;
    height: 54vw;
  }
`;

const CoverImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: ease 300ms;
  cursor: pointer;

  :hover {
    transform: scale(1.02);
    filter: brightness(0.95);
  }
`;
const Categories = styled.div`
  width: 75vw;
  border-radius: 1vw;
  background: #f3f3f3;
  display: flex;
  flex-wrap: wrap;
  gap: 1vw;
  box-sizing: border-box;
  padding: 1vw 0 1vw 1vw;

  @media only screen and (max-width: 621px) {
    width: 95vw;
    margin-top: 0vw;
    padding: 3vw;
    gap: 3vw;
  }
`;
const Category = styled.div`
  width: 17.5vw;
  height: 13vw;
  background: white;
  border-radius: 1vw;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);

  @media only screen and (max-width: 621px) {
    width: 43vw;
    height: 35vw;
  }
`;
const CategoryImg = styled.img`
  width: 20vw;
  height: 13vw;
  object-fit: cover;

  transition: ease 300ms;
  cursor: pointer;

  :hover {
    transform: scale(1.02);
    filter: brightness(0.95);
  }

  @media only screen and (max-width: 621px) {
    width: 43vw;
    height: 35vw;
  }
`;

const AdsCards = styled.div`
  width: 75vw;
  height: auto;
  box-sizing: border-box;
  border-radius: 1vw;
  display: flex;
  column-gap: 1vw;
  padding: 1vw;
  background: #f3f3f3;

  @media only screen and (max-width: 621px) {
    width: 95vw;
    padding: 3vw;
    column-gap: 3vw;
  }
`;
const AddCard = styled.div`
  width: 50%;
  height: 15vw;
  border-radius: 1vw;
  overflow: hidden;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);

  @media only screen and (max-width: 621px) {
    height: 40vw;
  }
`;

const AddCardImg = styled.img`
  width: 100%;
  height: 15vw;
  object-fit: cover;
  cursor: pointer;

  transition: ease 300ms;
  cursor: pointer;

  :hover {
    transform: scale(1.02);
    filter: brightness(0.95);
  }

  @media only screen and (max-width: 621px) {
    height: 40vw;
  }
`;
