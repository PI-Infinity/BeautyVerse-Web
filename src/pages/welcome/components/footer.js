import React from 'react';
import styled from 'styled-components';
import DownloadAppStore from '../../../assets/downloadAppStore.png';
import DownloadPlayStore from '../../../assets/google.png';
import {
  FaFacebook,
  FaGoogle,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from 'react-icons/fa';
import { MdMail } from 'react-icons/md';
import coverImg from '../../../assets/logo.png';
import { Language } from '../../../context/language';

export const Footer = () => {
  const language = Language();
  return (
    <Container>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <h4
          style={{
            color: '#f866b1',
            letterSpacing: '0.5px',
            margin: '0 0 15px 0',
          }}
        >
          {language?.language?.Auth?.auth?.findInSocialMedia}:
        </h4>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
          }}
        >
          <div
            style={{
              color: '#ccc',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FaInstagram />
          </div>
          <div
            style={{
              color: '#ccc',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FaFacebook />
          </div>
          <div
            style={{
              color: '#ccc',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FaYoutube />
          </div>
          <div
            style={{
              color: '#ccc',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FaLinkedin />
          </div>
          <div
            style={{
              color: '#ccc',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <FaTiktok />
          </div>
          <div
            style={{
              color: '#ccc',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <MdMail />
          </div>
        </div>
      </div>
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
                style={{ height: '25px', width: '72px' }}
                src={DownloadPlayStore}
                alt="Download on the App Store"
              />
            </a>
          </div>
        </TextContainer>
      </StoreButtons>

      <p
        style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '14px',
          letterSpacing: '0.5px',
        }}
      >
        &#169; Copyright
      </p>
    </Container>
  );
};

const Container = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  box-sizing: border-box;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextContainer = styled.div`
  div {
    height: 80px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h1 {
    color: #ccc;
    letter-spacing: 1px;
    margin: 0;
    margin-bottom: 10px;
    text-align: center;

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
    text-align: center;

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
  width: 80px;

  @media only screen and (max-width: 600px) {
    width: 80px;
  }
`;
