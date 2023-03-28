import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { Language } from '../../context/language';

export const Header = () => {
  const navigate = useNavigate();

  const language = Language();
  // import current user & parse it
  const user = JSON.parse(localStorage.getItem('Beautyverse:currentUser'));

  return (
    <Container>
      <div>
        <Avatar
          onClick={() => navigate(`/api/v1/users/${user?._id}`)}
          alt={user?.name}
          src={user?.cover ? user?.cover : ''}
          sx={{ width: 36, height: 36 }}
        />

        <h3 onClick={() => navigate(`/api/v1/users/${user?._id}`)}>
          {user?.name}
        </h3>
      </div>

      <h3>{language?.language.Chat.chat.title}</h3>
    </Container>
  );
};

const Container = styled.div`
  padding: 10px 20px;
  box-sizing: border-box;
  height: 70px;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};
  color: ${(props) => props.theme.font};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  // background: #fff;

  h3 {
    cursor: pointer;
    font-size: 14px;
    :hover {
      text-decoration: underline;
    }
  }

  div {
    display: flex;
    align-items: center;
    gap: 10px;
    @media only screen and (max-width: 600px) {
      display: none;
    }
  }
  @media only screen and (max-width: 600px) {
    display: none;
    width: 100%;
    height: 6vh;
    border-top: 1px solid #ddd;
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
