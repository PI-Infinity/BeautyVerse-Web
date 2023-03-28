import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ImCheckmark } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Language } from '../../context/language';
import Avatar from '@mui/material/Avatar';

export const Favorites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const language = Language();

  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const [followings, setFollowings] = useState();

  useEffect(() => {
    async function GetAudience() {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/followings`
      )
        .then((response) => response.json())
        .then((data) => {
          setFollowings(data.data.followings);
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    }
    if (currentUser) {
      GetAudience();
    }
  }, [currentUser?._id]);

  return (
    <Container>
      <Title>
        {language?.language?.Main?.favourites?.title}{' '}
        <ImCheckmark className="likedIcon" />
      </Title>
      <List>
        {followings?.length > 0 &&
          followings?.map((item, index) => {
            return (
              <Item
                key={index}
                // onClick={() =>
                //   dispatch(setTargetUser({ id: item.id, name: item.name }))
                // }
                onClick={() =>
                  navigate(`/api/v1/users/${item.followingAuthId}`)
                }
              >
                <Avatar
                  alt={item?.followingName}
                  src={item?.followingCover && item?.followingCover}
                  sx={{ width: 30, height: 30 }}
                />
                <span>{item?.followingName}</span>
              </Item>
            );
          })}
      </List>
    </Container>
  );
};

const Container = styled.div`
  width: 24vw;
  height: 22vw;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-bottom: 0.5vw;
  padding-right: 2vw;
  overflow-y: scroll;
  margin-top: 30px;
`;

const Title = styled.div`
  color: ${(props) => props.theme.font};
  display: flex;
  justify-content: flex-end;
  gap: 0.25vw;
  align-items: center;
  margin-top: 1.25vw;
  font-weight: bold;
  font-size: 18px;

  .likedIcon {
    font-size: 16px;
    color: #2c976d;
  }
`;

const List = styled.div`
  padding-top: 1vw;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3vw;
`;

const Item = styled.div`
  width: 80%;
  padding: 0.25vw;
  box-sizing: border-box;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 0.5vw;
  border-radius: 50vw;
  transition: ease-in 200ms;
  cursor: pointer;
  color: ${(props) => props.theme.font};
  background: ${(props) => props.theme.categoryItem};
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.05);
  font-size: 14px;

  &:hover {
    filter: brightness(0.8);
  }
`;
