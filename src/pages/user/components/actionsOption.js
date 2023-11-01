import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RiUserFollowFill, RiUserUnfollowFill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

export const ActionsOption = ({ user }) => {
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const [followerDefined, setFollowerDefined] = useState(0);

  // useEffect to check follower
  useEffect(() => {
    async function checkFollower() {
      const response = await fetch(
        backendUrl +
          `/api/v1/users/${user?._id}/followers/${currentUser?._id}/check/`
      )
        .then((response) => response.json())
        .then(async (data) => {
          setFollowerDefined(data.data?.follower);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    }
    if (user?._id) {
      checkFollower();
    }
  }, [user?._id]);

  // function to follow user
  const Follow = async () => {
    try {
      setFollowerDefined({
        followerId: currentUser?._id,
        followerName: currentUser?.name,
        followerCover: currentUser?.cover,
        followerType: currentUser?.type,
        followingId: user?._id,
        followAt: new Date(),
      });
      await axios.post(
        backendUrl + `/api/v1/users/${currentUser?._id}/followings`,
        {
          followingId: user?._id,
          followerId: currentUser?._id,
          followAt: new Date(),
        }
      );
      await axios.post(backendUrl + `/api/v1/users/${user?._id}/followers`, {
        followerId: currentUser?._id,
        followingId: user?._id,
        followAt: new Date(),
      });

      await axios.post(
        backendUrl + `/api/v1/users/${user?._id}/notifications`,
        {
          senderId: currentUser?._id,
          text: ``,
          date: new Date(),
          type: 'follow',
          status: 'unread',
          feed: '',
        }
      );

      // if (user?.pushNotificationToken) {
      //   await sendNotification(
      //     user?.pushNotificationToken,
      //     currentUser.name,
      //     'saved your profile!',
      //     {
      //       user: JSON.stringify(currentUser),
      //     }
      //   );
      // }
      // socket.emit('updateUser', {
      //   targetId: props.user?._id,
      // });

      // const data = await response.data;
    } catch (error) {
      console.error(error.response.data.message);
    }
  };
  // function to unfollow user
  const Unfollow = async () => {
    try {
      setFollowerDefined('');
      const url =
        backendUrl +
        `/api/v1/users/${currentUser?._id}/followings/${user?._id}`;
      await fetch(url, { method: 'DELETE' })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
      const url2 =
        backendUrl + `/api/v1/users/${user?._id}/followers/${currentUser._id}`;
      await fetch(url2, { method: 'DELETE' })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log('Error fetching data:', error);
        });

      // const data = await response.data;
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <>
      {followerDefined !== 0 && (
        <Container
          on={followerDefined ? 'true' : 'false'}
          onClick={followerDefined ? () => Unfollow() : () => Follow()}
        >
          {followerDefined ? (
            <RiUserFollowFill color="#f866b1" size={24} />
          ) : (
            <RiUserUnfollowFill color="#ccc" size={24} />
          )}
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  right: 22.5px;
  bottom: 75px;
  background: rgba(1, 2, 12, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  width: 45px;
  height: 45px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
`;
