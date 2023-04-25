import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IsMobile } from '../../functions/isMobile';
import { useOutletContext, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import UserListDialogMain from '../../pages/user/userListPopup';
import { Spinner } from '../../components/loader';
import { AudienceLoader } from '../../components/loader';

export const Audience = () => {
  const [targetUser, language] = useOutletContext();
  const isMobile = IsMobile();
  const navigate = useNavigate();
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const [loading, setLoading] = React.useState(true);

  const [followers, setFollowers] = useState();
  const [followings, setFollowings] = useState();

  const [render, setRender] = useState(false);

  useEffect(() => {
    async function GetAudience(userId) {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followings`
      )
        .then((response) => response.json())
        .then((data) => {
          setFollowings({
            length: data?.data?.followings.length,
            list: data.data?.followings,
          });
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    }
    if (targetUser?._id) {
      GetAudience();
    }
  }, [targetUser?._id, render]);
  useEffect(() => {
    async function GetAudience(userId) {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followers`
      )
        .then((response) => response.json())
        .then((data) => {
          setFollowers({
            length: data?.data?.followers.length,
            list: data.data?.followers,
          });
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    }
    if (targetUser?._id) {
      GetAudience();
    }
  }, [targetUser?._id, render]);

  setTimeout(() => {
    setLoading(false);
  }, 400);

  return (
    <Content>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {loading ? (
            <AudienceLoader />
          ) : (
            <>
              {followers && (
                <UserListDialogMain
                  title={language?.language.User.userPage.followers}
                  users={followers?.list}
                  type="followers"
                  targetUser={targetUser}
                  language={language}
                  setRender={setRender}
                  render={render}
                />
              )}
              <AvatarGroup total={followers?.length}>
                {followers?.list.map((item, index) => {
                  return (
                    <Avatar
                      alt={item?.followerName}
                      src={item?.followerCover}
                      onClick={
                        item?.followerType === 'user'
                          ? () =>
                              navigate(
                                isMobile
                                  ? `/api/v1/users/${item._doc.followerId}/contact`
                                  : `/api/v1/users/${item._doc.followerId}/audience`
                              )
                          : () =>
                              navigate(`/api/v1/users/${item._doc.followerId}`)
                      }
                      style={{ cursor: 'pointer' }}
                    />
                  );
                })}
              </AvatarGroup>
            </>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {loading ? (
            <AudienceLoader />
          ) : (
            <>
              {followings && (
                <UserListDialogMain
                  title={language?.language.User.userPage.followings}
                  users={followings?.list}
                  type="followings"
                  targetUser={targetUser}
                  language={language}
                  setRender={setRender}
                  render={render}
                />
              )}
              <AvatarGroup total={followings?.length}>
                {followings?.list.map((item, index) => {
                  // let us = users?.find((it) => it.id === item.id);
                  return (
                    <Avatar
                      alt={item?.followingName}
                      src={item?.followingCover}
                      onClick={
                        item?.followingType === 'user'
                          ? () =>
                              navigate(
                                isMobile
                                  ? `/api/v1/users/${item._doc.followingId}/contact`
                                  : `/api/v1/users/${item._doc.followingId}/audience`
                              )
                          : () =>
                              navigate(`/api/v1/users/${item._doc.followingId}`)
                      }
                      style={{ cursor: 'pointer' }}
                    />
                  );
                })}
              </AvatarGroup>{' '}
            </>
          )}
        </div>
      </div>
    </Content>
  );
};

const Content = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 3vw;
  width: 100%;
  height: 100%;
  min-height: 50vh;
  flex-wrap: wrap;
  gap: 0.5vw;
  height: auto;
  margin-bottom: 5vw;
  overflow-x: hidden;
  box-sizing: border-box;

  .loadingIcon {
    font-size: 3vw;
  }

  @media only screen and (max-width: 600px) {
    height: auto;
    justify-content: start;
    padding-top: 6vw;
    padding-left: 6vw;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding: 0.5vw;
  gap: 0.5vw;

  & span {
    @media only screen and (max-width: 600px) {
      margin: 3vw;
      font-size: 14px;
      font-weight: normal;
      font-style: italic;
      color: ${(props) => props.theme.disabled};
    }
  }

  @media only screen and (max-width: 600px) {
    gap: 2vw;
  }
`;
