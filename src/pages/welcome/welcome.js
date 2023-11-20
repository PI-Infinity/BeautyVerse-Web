import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Cover } from './components/cover';
import { About } from './components/about';
import { Features } from './components/features';
import { FaArrowsAltV } from 'react-icons/fa';
import { Form } from './components/form';
import { LanguageComponent } from './components/language';
import { useDeviceType } from '../../functions/device';
import { KeyFeatures } from './components/keyFeatures';
import { Footer } from './components/footer';

const Welcome = () => {
  const device = useDeviceType();
  /**
   * on scroll animation
   */

  // get scrolling starting y position
  const scrollRef = useRef(null);

  // scroll to top when page open
  useEffect(() => {
    // For Safari
    document.body.scrollTop = 0;
    // For Chrome, Firefox, IE and Opera
    document.documentElement.scrollTop = 0;
  }, []);

  // get device height
  const [slideAbout, setSlideAbout] = useState(false);
  const viewportHeight = window.innerHeight;

  // on scroll get startting y position function
  const handleScroll = () => {
    if (scrollRef.current) {
      if (scrollRef.current.scrollTop >= viewportHeight) setSlideAbout(true);
    }
  };

  return (
    <Container ref={scrollRef} onScroll={handleScroll}>
      <SnapSection>
        <Cover />
        <div className="divider">
          <div></div>
          <FaArrowsAltV color="rgba(255,255,255,0.1)" size="24px" />
          <div></div>
        </div>
      </SnapSection>
      {device === 'Mobile' && (
        <SnapSection>
          <LanguageComponent />
          <div className="divider">
            <div></div>
            <FaArrowsAltV color="rgba(255,255,255,0.1)" size="24px" />
            <div></div>
          </div>
        </SnapSection>
      )}

      <SnapSection>
        <KeyFeatures
          style={{
            position: 'relative',
            left: slideAbout ? '0' : '-100%',
          }}
        />
        <div className="divider">
          <div></div>
          <FaArrowsAltV color="rgba(255,255,255,0.1)" size="24px" />
          <div></div>
        </div>
      </SnapSection>
      <SnapSection>
        <Form />
      </SnapSection>
      <Footer />
    </Container>
  );
};

export default Welcome;

// title
const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
   
  }
  to {
    transform: translateY(0);
    opacity: 1;
   
  }
`;

const Container = styled.div`
  width: 100vw;
  overflow: hidden;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const SnapSection = styled.div`
  scroll-snap-align: start;
  width: 100%;

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .divider {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    animation: ${slideIn} 1.5s ease-in-out;

    div {
      height: 1.5px;
      border-radius: 50px;
      width: 45%;
      background-color: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;

      @media only screen and (max-width: 600px) {
        width: 40%;
      }
    }
  }
`;
