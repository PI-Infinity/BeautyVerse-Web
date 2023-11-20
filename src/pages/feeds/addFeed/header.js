import Badge from '@mui/material/Badge';
import React from 'react';
import { BiImageAdd } from 'react-icons/bi';
import { IoMdArrowRoundBack, IoMdNotifications } from 'react-icons/io';
import { MdSettings } from 'react-icons/md';
import { VscVerifiedFilled } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Language } from '../../../context/language';

/**
 *
 * user page
 */

export const Header = ({ user }) => {
  const navigate = useNavigate();
  const language = Language();

  const unreadNotifications = useSelector(
    (state) => state.storeNotifications.unreadNotifications
  );

  return (
    <Container>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <IoMdArrowRoundBack
          size={30}
          color="#f866b1"
          style={{ position: 'relative', left: '15px' }}
          className="back"
          onClick={() => {
            navigate('/profile/feeds');
          }}
        />
        <LogoTitle style={{ position: 'relative', left: '15px' }}>
          {language?.language?.User?.userPage?.addFeed}
        </LogoTitle>
        <div style={{ width: '30px' }}></div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 100%;
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
