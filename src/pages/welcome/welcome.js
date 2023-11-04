import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Cover } from './components/cover';
import { About } from './components/about';
import { Features } from './components/features';
import { FaArrowsAltV } from 'react-icons/fa';
import { Form } from './components/form';

const Welcome = () => {
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
          <FaArrowsAltV color="rgba(255,255,255,0.3)" size="24px" />
          <div></div>
        </div>
      </SnapSection>
      {/* <SnapSection style={{ minHeight: "100vh" }}>
        <About
          style={{
            position: "relative",
            left: slideAbout ? "0" : "-100%",
          }}
        />
        <div className="divider">
          <div></div>
          <FaArrowsAltV color="rgba(255,255,255,0.3)" size="24px" />
          <div></div>
        </div>
      </SnapSection> */}
      <SnapSection>
        <Form />
      </SnapSection>
    </Container>
  );
};

export default Welcome;

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
  height: 100vh;
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

    div {
      height: 3px;
      border-radius: 50px;
      width: 40%;
      background-color: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;

      @media only screen and (max-width: 600px) {
        width: 150px;
      }
    }
  }
`;
