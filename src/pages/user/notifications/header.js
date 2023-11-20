import React from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Language } from '../../../context/language';

/**
 *
 * user page
 * @returns
 */

export const Header = ({ back }) => {
  const navigate = useNavigate();
  const language = Language();

  return (
    <Container>
      <IoMdArrowRoundBack
        size={30}
        color="#f866b1"
        style={{ position: 'relative', left: '15px' }}
        className="back"
        onClick={() => {
          setTimeout(() => {
            navigate(back);
          }, 10);
        }}
      />

      <LogoTitle style={{ position: 'relative', left: 0 }}>
        {language?.language?.User?.userPage?.notifications}
      </LogoTitle>

      <div style={{ width: '30px' }}></div>
    </Container>
  );
};

const Container = styled.div`
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100vw;
  height: 10vh;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
  justify-content: space-between;
  align-items: center;
  display: flex;
  z-index: 10001;

  @media only screen and (max-width: 600px) {
    height: 8vh;
  }

  .back {
    &:hover {
      opacity: 0.8;
    }
  }
`;

const LogoTitle = styled.h1`
  color: ${(props) => (props.part === 1 ? '#f866b1' : '#ccc')};
  letter-spacing: 1.2px;

  @media only screen and (max-width: 600px) {
    font-size: 5.5vw;
  }
`;
