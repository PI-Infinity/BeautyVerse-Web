import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ImList2 } from 'react-icons/im';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';

export const TopSection = (props) => {
  const navigate = useNavigate();

  const chatUser = useSelector(
    (state) => state.storeChat.currentChat.targetChatUser
  );

  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Avatar
          onClick={() => navigate(`/api/v1/users/${chatUser.authId}`)}
          alt={chatUser?.name}
          src={chatUser?.cover !== undefined ? chatUser?.cover : ''}
          sx={{ width: 36, height: 36 }}
        />
        <h4 onClick={() => navigate(`/api/v1/users/${chatUser.authId}`)}>
          {chatUser?.name}
        </h4>
      </div>
      <ImList2 id="closeIcon" onClick={() => navigate('/chat')} />
    </Container>
  );
};

const Container = styled.div`
  padding: 30px 20px;
  height: 30px;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.font};
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    height: 15vw;
    min-height: 15vw;
    box-sizing: border-box;
    padding: 2vw 4vw 2vw 3vw;
    z-index: 1000;
    width: 100vw;
    margin: 0;
  }

  h4 {
    cursor: pointer;
    font-size: 14px;
    :hover {
      text-decoration: underline;
    }
  }

  #closeIcon {
    display: flex;
    font-size: 16px;
    cursor: pointer;
    @media only screen and (max-width: 600px) {
    }
  }
`;

const Img = styled.img`
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    width: 8vw;
    height: 8vw;
  }
`;

const UserProfileEmpty = styled.div`
  width: 2.2vw;
  height: 2.2vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 9vw;
    height: 9vw;
  }

  .user {
    font-size: 1.2vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;
