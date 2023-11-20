import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import coverImg from '../../../assets/logo.png';
import DownloadAppStore from '../../../assets/downloadAppStore.png';
import DownloadPlayStore from '../../../assets/google.png';
import Button from '@mui/material/Button';
import { AiFillAppstore } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useDeviceType } from '../../../functions/device';
import { Language } from '../../../context/language';
import { LanguageComponent } from './language';
import { MdDoubleArrow } from 'react-icons/md';

export const Cover = () => {
  const navigate = useNavigate();
  const device = useDeviceType();
  const language = Language();

  return (
    <Container>
      <LogoContainer>
        <AnimatedImage src={coverImg} alt="BeautyVerse" />
      </LogoContainer>
      <AnimatedContainer>
        <TextContainer>
          <h1>{language?.language?.Auth?.auth?.slogan}</h1>
        </TextContainer>
        <TextContainer>
          <h2>{language?.language?.Auth?.auth?.subSlogan}</h2>
        </TextContainer>

        {device === 'Mobile' && (
          <GoButton variant="contained" onClick={() => navigate('/feeds')}>
            {language?.language?.Auth?.auth?.goToApp}
            <MdDoubleArrow
              // color="#ccc"
              size={24}
              style={{ marginLeft: '8px' }}
            />
          </GoButton>
        )}
        {device === 'Mobile' && (
          <StoreButtons>
            <TextContainer>
              <div>
                <a
                  style={{ padding: '0', margin: '0' }}
                  href="https://apps.apple.com/app/6448795980"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <AppStoreImage
                    src={DownloadAppStore}
                    alt="Download on the App Store"
                  />
                </a>
              </div>
            </TextContainer>
            <TextContainer>
              <div>
                <a
                  onClick={() =>
                    alert('Andorid not supported yet, we are working for it!')
                  }
                  style={{ padding: '0', margin: '0' }}
                  // href="https://apps.apple.com/app/6448795980"
                  // target="_blank"
                  // rel="noopener noreferrer"
                >
                  <AppStoreImage
                    style={{ height: '46px', width: '142px' }}
                    src={DownloadPlayStore}
                    alt="Download on the App Store"
                  />
                </a>
              </div>
            </TextContainer>
          </StoreButtons>
        )}
        {device === 'Desktop' && (
          <div style={{ marginTop: '20px' }}>
            <LanguageComponent />
          </div>
        )}
      </AnimatedContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 0 3vh 0;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    height: 90%;
    justify-content: start;
    padding: 0 0 1vh 0;
  }
`;

// image
const fadeIn = keyframes`
from {
  opacity: 0;
  transform: scale(0.8) rotate(180deg);
}
to {
  opacity: 1;
  transform: scale(1) rotate(360deg);
}
`;

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
   
  }
  to {
    transform: translateX(0);
    opacity: 1;
   
  }
`;
const slideInMobile = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
   
  }
  to {
    transform: translateY(0);
    opacity: 1;
   
  }
`;

const LogoContainer = styled.div`
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 90%;
    height: 370px;
  }
`;

const AnimatedImage = styled.img`
  width: 650px;
  position: relative;
  // right: 40px;

  animation: ${fadeIn} 0.75s ease-in-out;

  @media only screen and (max-width: 600px) {
    width: 90%;
    right: 0px;
    bottom: 20px;
  }
`;

const AnimatedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: ${slideIn} 0.75s ease-in-out;
  min-width: 600px;

  @media only screen and (max-width: 600px) {
    min-width: auto;
    position: relative;
    align-items: center;
    bottom: 40px;
    animation: ${slideInMobile} 0.75s ease-in-out;
  }
`;

const TextContainer = styled.div`
  div {
    height: 80px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
  }
  h1 {
    color: #ccc;
    letter-spacing: 1px;
    margin: 0;
    margin-bottom: 10px;

    @media only screen and (max-width: 600px) {
      text-align: center;
      font-size: 5.5vw;
    }
  }
  h2 {
    color: #ccc;
    letter-spacing: 1px;
    margin: 0;
    padding: 0;
    margin-bottom: 10px;
    font-weight: normal;

    @media only screen and (max-width: 600px) {
      text-align: center;
      font-size: 4vw;
    }
  }
`;

const StoreButtons = styled.div`
  display: flex;
  gap: 8px;
  position: relative;
  right: 7px;

  @media only screen and (max-width: 600px) {
    right: 4px;
  }
`;

const AppStoreImage = styled.img`
  width: 150px;

  @media only screen and (max-width: 600px) {
    width: 150px;
  }
`;

const GoButton = styled(Button)`
  && {
    background-color: #f866b1;
    color: #fff;
    font-weight: bold;
    margin-top: 20px;
    min-width: 60%;
    height: 45px;
    border-radius: 50px;
    padding: 5px 20px;

    @media only screen and (max-width: 600px) {
      height: auto;
      margin-top: 30px;
    }

    &:hover {
      background-color: #fff; // change background color when hovered
      color: #f866b1;
      font-weight: bold;
    }
  }
`;
