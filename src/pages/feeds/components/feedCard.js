import React, { useState } from 'react';
import styled from 'styled-components';
import { TopSection } from './topSection';
import { BottomSection } from './bottomSection';
import { useLocation, useNavigate } from 'react-router-dom';
import { setOpenedFeed } from '../../../redux/feed';
import { useDispatch } from 'react-redux';
import { AnimationSkelton } from '../../../components/animationSkelton';
import VideoComponent from './videoComponent';
import { BounceLoader } from 'react-spinners';

export const FeedCard = ({ item, goToFeeds }) => {
  // define file sizes
  const fileWidth = item?.fileWidth;
  const fileHeight = item?.fileHeight;
  const aspectRatio = fileWidth / fileHeight; // 0.6

  const screenWidth = window.innerWidth;
  const screenHeight = screenWidth / aspectRatio;

  // define navigate
  const navigate = useNavigate();

  // defines location
  const location = useLocation();

  // redux dispatch
  const dispatch = useDispatch();

  // image loading opacity
  const [opacity, setOpacity] = useState(false);

  const widthReduction = 20;
  const reductionPercent = (widthReduction / screenWidth) * 100;
  const adjustedHeight = screenHeight - screenHeight * (reductionPercent / 100);

  return (
    <Container>
      <TopSection item={item} />
      <ImageContainer
        width={screenWidth - widthReduction}
        height={adjustedHeight}
      >
        {/* {!opacity && ( */}
        {/* <AnimationSkelton
          width={`${screenWidth - 20}px`}
          height={`${screenHeight}px`}
          borderRadius={20}
        /> */}
        {/* )} */}

        <BounceLoader
          style={{
            position: 'absolute',
            zIndex: -1,
            marginRight: '40px',
            marginBottom: '40px',
          }}
          size={40}
          color="#f866b1"
        />

        {item?.fileFormat === 'img' ? (
          <>
            {item?.images?.map((itm, index) => {
              return (
                <Image
                  onClick={() => {
                    if (!goToFeeds) {
                      if (location.pathname === '/feeds') {
                        navigate(`/feeds/${item?._id}`);
                        dispatch(setOpenedFeed(item));
                      } else {
                        return undefined;
                      }
                    } else {
                      goToFeeds();
                    }
                  }}
                  key={index}
                  src={itm?.url}
                  width={screenWidth - widthReduction}
                  height={adjustedHeight}
                  style={{
                    opacity: opacity ? 1 : 0,
                    transition: 'ease-in 300ms',
                    borderRadius: '20px',
                  }}
                  onLoad={() => setOpacity(true)}
                />
              );
            })}
          </>
        ) : (
          <VideoComponent
            item={item}
            location={location}
            screenHeight={adjustedHeight}
            screenWidth={screenWidth - widthReduction}
          />
        )}
      </ImageContainer>
      <BottomSection item={item} />
    </Container>
  );
};

const Container = styled.div`
  width: 40%;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;

const ImageContainer = styled.div`
  width: ${(props) => props.width / 2.5}px;
  height: ${(props) => props.height / 2.5}px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-left: 10px;
  border-radius: 20px;
  max-height: 1080px;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-left: 10px;
    border-radius: 20px;
  }
`;

const Image = styled.img`
  width: ${(props) => props.width / 2.5}px;
  height: ${(props) => props.height / 2.5}px;

  @media only screen and (max-width: 600px) {
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
  }
`;
