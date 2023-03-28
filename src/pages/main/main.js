import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Filter } from '../../pages/main/filter';
import { CategoryFilter } from '../../pages/main/categoryFilter';
import { Ads } from '../../pages/main/ads';
import { Favorites } from '../../pages/main/favorites';
import { Chat } from '../../pages/main/chat';
import { useSelector, useDispatch } from 'react-redux';
import { setRegisterPage } from '../../redux/register';
import { FilterMobile } from '../../pages/main/filterMobile';
import { useNavigate, Outlet } from 'react-router-dom';
import { setNavigatorActive } from '../../redux/main';
import { setScroll } from '../../redux/scroll';
import useWindowDimensions from '../../functions/dimensions';
import { IsMobile } from '../../functions/isMobile';

const Main = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rerender = useSelector((state) => state.storeMain.rerender);
  const loadFeed = useSelector((state) => state.storeMain.loadFeed);
  const changeFeed = useSelector((state) => state.storeMain.changeFeed);

  const isMobile = IsMobile();
  const { height, width } = useWindowDimensions();

  React.useEffect(() => {
    dispatch(setScroll(true));
    dispatch(setNavigatorActive(0));
  }, [rerender, changeFeed]);

  document.body.style.overflowY = 'scroll';

  // open mobile filter
  const filterOpen = useSelector((state) => state.storeMain.mobileFilter);

  useEffect(() => {
    dispatch(setRegisterPage(1));
  }, []);

  return (
    <>
      <MobileFilter filterOpen={filterOpen}>
        <FilterMobile />
      </MobileFilter>
      <Container height={height}>
        {!isMobile && (
          <FilterSection>
            <Filter />
          </FilterSection>
        )}
        <MainSection>
          <FilterContainer>
            <CategoryFilter />
            <Ads
              left={true}
              leftAd="https://res.cloudinary.com/dmmumy2b1/image/upload/v1668849735/Beautyverse/shop_ggr6lu.jpg"
              rightAd="https://res.cloudinary.com/dmmumy2b1/image/upload/v1668849826/Beautyverse/konkurspost_fn7zqk.png"
            />
          </FilterContainer>
          <CenterContainer height={height}>
            <Outlet />
          </CenterContainer>
          <RightSide>
            <Ads
              leftAd="https://res.cloudinary.com/mimino/image/upload/v1673281470/ELAN/products/detox-mousse-3-900x900-min_as8ysq.jpg"
              rightAd="https://res.cloudinary.com/mimino/image/upload/v1673281471/ELAN/products/smart-skin-colour-remover-1-900x900-min_a0oruf.jpg"
            />
            <FavoritesContainer>
              {/* <Reviews /> */}
              <Favorites />
              <Chat />
            </FavoritesContainer>
          </RightSide>
        </MainSection>
      </Container>
    </>
  );
};

export default Main;

const Container = styled.div`
  width: 100%;
  // height: ${(props) => props.height}px;
  // max-heigth: ${(props) => props.height}px;
  padding-top: 3.4vw;
  box-sizing: border-box;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    padding-top: 5vw;
    min-height: auto;
  }
`;

const FilterSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 2.8vw;
  width: 100%;
  box-sizing: border-box;
  z-index: 10;
  -webkit-transition: all 300ms ease;
  -moz-transition: all 300ms ease;
  -ms-transition: all 300ms ease;
  -o-transition: all 300ms ease;
  transition: all 500ms ease;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const MainSection = styled.div`
  display: flex;
  position: absolute;
  top: 6vw;

  @media only screen and (max-width: 600px) {
    top: 0vw;
  }
`;
const FilterContainer = styled.div`
  flex: 2;
  border-right: 1px solid ${(props) => props.theme.lineColor};
  position: fixed;
  left: 0;
  width: 25vw;
  padding-left: 2vw;
  height: 100%;

  & > div {
    color: ${(props) => props.theme.font};
  }

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;
const CenterContainer = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 52vw;
  left: 25vw;
  z-index: 9;
  padding: 0 2vw 3vw 2vw;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    height: auto;
    max-height: auto;
    top: 0;
    left: 0;
    padding: 0;
  }
`;

const MobileFilter = styled.div`
  display: ${(props) => (props.filterOpen ? 'flex' : 'none')};
  position: absolute;
  top: 18vw;
  left: 0;
  width: 100%;
  z-index: 10001;
  background: ${(props) => props.theme.background};
  backdrop-filter: blur(40px);
`;

const FavoritesContainer = styled.div`
  flex: 2;
  z-index: 9;
`;

const RightSide = styled.div`
  position: fixed;
  right: 0;
  border-left: 1px solid ${(props) => props.theme.lineColor};
  width: 25vw;
  height: 100vh;
  z-index: 9;
  display: flex;
  flex-direction: column;
  align-items: center;

  & > div {
    color: ${(props) => props.theme.font};
  }

  @media only screen and (max-width: 600px) {
    right: -100%;
  }
`;

const Loading = styled.div`
  width: 53vw;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;

  @media only screen and (max-width: 600px) {
    width: 99.8vw;
  }
`;
