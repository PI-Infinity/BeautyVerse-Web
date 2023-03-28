import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import {
  getDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { setRerender, setCurrentChat, setActiveTab } from '../../redux/chat';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../../components/loader';
import Avatar from '@mui/material/Avatar';

export const Favourites = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  // import current user & parse it
  const currentuser = useSelector((state) => state.storeMain.user);

  const chats = useSelector((state) => state.storeChat.userChats);

  // import followings
  const [followings, setFollowings] = useState([]);
  useEffect(() => {
    async function GetAudience(userId) {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentuser?._id}/followings`
      )
        .then((response) => response.json())
        .then((data) => {
          setFollowings(data.data.followings);
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    }
    if (currentuser) {
      GetAudience();
    }
  }, [currentuser]);

  // define chat number includes in user chat list or it is new.
  const GetRoom = (roomMember) => {
    let chatRoom = chats.find((item) =>
      item.room.toLowerCase().includes(roomMember)
    );
    return chatRoom;
  };

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <Container>
          {followings
            ?.filter((item, index) => {
              if (
                item?.followingName
                  ?.toLowerCase()
                  ?.includes(props.search?.toLowerCase())
              ) {
                return item;
              }
            })
            ?.map((item, index) => {
              return (
                <UserItem
                  onClick={async () => {
                    let room = await GetRoom(item.followingId);
                    if (room) {
                      props.handleRoomChange(room.room);
                    } else {
                      props.handleRoomChange(
                        currentuser?._id + '&' + item.followingId
                      );
                    }
                    // navigate(
                    //   `/chat/${item.followingId + '&' + currentuser?._id}`
                    // );
                    dispatch(
                      setCurrentChat({
                        room: room
                          ? room.room
                          : currentuser?._id + '&' + item.followingId,
                        curentChatUser: currentuser?._id,
                        targetChatUser: {
                          authId: item?.followingAuthId,
                          id: item?.followingId,
                          name: item.followingName,
                          cover: item.followingCover,
                        },
                      })
                    );
                  }}
                  key={index}
                >
                  {/* <UserItem onClick={() => handleSelect(item)} key={index}> */}
                  <Avatar
                    alt={item?.followingName}
                    src={item?.followingCover}
                    sx={{ width: 36, height: 36 }}
                  />

                  <h3>{item?.followingName}</h3>
                </UserItem>
              );
            })}
        </Container>
      )}
    </>
  );
};

const LoadingContainer = styled.div`
  height: 59vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 10px;
  padding: 10px 0;
  width: 70%;
  // background: #fff;

  @media only screen and (max-width: 600px) {
    height: 70vh;
    overflow-y: scroll;
    overflow-x: hidden;
    gap: 4vw;
    width: 100%;
    padding: 0 5%;
  }
`;

const Img = styled.img`
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  object-fit: cover;

  @media only screen and (max-width: 600px) {
    width: 10vw;
    height: 10vw;
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 0 20px;
  color: ${(props) => props.theme.font};

  h3 {
    font-size: 14px;
    color: ${(props) => props.theme.font};
    margin: 0;
  }

  :hover {
    filter: brightness(0.95);
  }

  @media only screen and (max-width: 600px) {
    border-radius: 50vw;
    padding: 0;
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
