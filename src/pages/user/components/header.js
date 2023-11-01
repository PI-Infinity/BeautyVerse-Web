import React from 'react';
import { BiImageAdd } from 'react-icons/bi';
import { IoMdArrowRoundBack, IoMdNotifications } from 'react-icons/io';
import { MdSettings } from 'react-icons/md';
import { VscVerifiedFilled } from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import { setTargetUser } from '../../../redux/user';
import { setBackPath } from '../../../redux/app';

/**
 *
 * user page
 */

export const Header = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const back = useSelector((state) => state.storeApp.backPath);

  return (
    <Container>
      <IoMdArrowRoundBack
        size={30}
        color="#f866b1"
        style={{ position: 'relative', left: '15px' }}
        className="back"
        onClick={() => {
          navigate(back.path[back.activeLevel]);
          dispatch(setTargetUser(back.data[back.activeLevel - 1]));
          dispatch(
            setBackPath({
              path: back.path.slice(0, -1),
              data: back.data.slice(0, -1),
              activeLevel: back.activeLevel - 1,
              back: true,
            })
          );
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: back ? '5px' : '20px',
        }}
      >
        <LogoTitle style={{ position: 'relative', left: back ? 0 : '15px' }}>
          {user?.name}{' '}
        </LogoTitle>
        {user?.subscription?.status === 'active' && (
          <VscVerifiedFilled color="#f866b1" size={18} />
        )}
      </div>
      <div style={{ width: '30px' }}></div>
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
