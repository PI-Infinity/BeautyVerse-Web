import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { Language } from '../../../context/language';
import { BounceLoader } from 'react-spinners';
import { setTargetUser, setTargetUserVisit } from '../../../redux/user';
import { setBackPath } from '../../../redux/app';
import { AudienceListPopup } from './audienceListPopup';

const Audience = () => {
  // defines language
  const language = Language();

  // location
  const location = useLocation();

  // get outlet props context
  const [targetUser] = useOutletContext();

  // define loading state
  const [loading, setLoading] = useState(true);

  // define followers and followings states
  const [followers, setFollowers] = useState([]);
  const [followersLength, setFollowersLength] = useState(null);
  const [followings, setFollowings] = useState([]);
  const [followingsLength, setFollowingsLength] = useState(null);

  // define addational render state
  const [render, setRender] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Get Audience
   */

  // get followings
  const [followingsPage, setFollowingsPage] = useState(1);

  let userId = targetUser?._id;

  useEffect(() => {
    async function GetAudience() {
      try {
        const response = await axios.get(
          backendUrl + `/api/v1/users/${userId}/followings?page=1&limit=10`
        );
        setFollowings(response.data.data.followings);
        setFollowingsLength(response.data.result);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
    GetAudience();
  }, [render, userId, targetUser]);

  // get followers
  const [followersPage, setFollowersPage] = useState(1);

  useEffect(() => {
    async function GetAudience() {
      try {
        const response = await axios.get(
          backendUrl + `/api/v1/users/${userId}/followers?page=1&limit=10`
        );
        setFollowers(response.data.data.followers);
        setFollowersLength(response.data.result);
        setTimeout(() => {
          setLoading(false);
        }, 100);
      } catch (error) {
        console.log(error.response.data.message);
      }
    }

    GetAudience();
  }, [render, userId, targetUser]);

  /**
   * full list showing
   */
  // open list popup
  const [openList, setOpenList] = useState({
    type: '',
    active: false,
    data: {},
  });

  return (
    <>
      {loading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '50vh',
          }}
        >
          <BounceLoader color={'#f866b1'} loading={loading} size={40} />
        </div>
      ) : (
        <Container>
          <AudienceSection>
            <AudienceLabel
              onClick={
                followers?.length > 0
                  ? () =>
                      setOpenList({
                        type: 'followers',
                        active: true,
                        data: followers,
                      })
                  : undefined
              }
            >
              Followers
            </AudienceLabel>
            {followersLength > 0 ? (
              <StyledAvatarGroup
                renderSurplus={(surplus) => (
                  <SurplusStyle
                    onClick={() =>
                      setOpenList({
                        type: 'followers',
                        active: true,
                        data: followers,
                      })
                    }
                  >
                    +{surplus.toString()[0]}
                  </SurplusStyle>
                )}
                total={followersLength}
                style={{}}
                max={4}
              >
                {followers?.map((item, index) => {
                  return (
                    <ListItem item={item} key={index} targetUser={targetUser} />
                  );
                })}
              </StyledAvatarGroup>
            ) : (
              <span
                style={{
                  color: '#888',
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                }}
              >
                No followers found!
              </span>
            )}
          </AudienceSection>

          <AudienceSection>
            <AudienceLabel
              onClick={
                followings?.length > 0
                  ? () =>
                      setOpenList({
                        type: 'followings',
                        active: true,
                        data: followings,
                      })
                  : undefined
              }
            >
              Followings
            </AudienceLabel>
            {followingsLength > 0 ? (
              <StyledAvatarGroup
                renderSurplus={(surplus) => (
                  <SurplusStyle
                    onClick={() =>
                      setOpenList({
                        type: 'followings',
                        active: true,
                        data: followings,
                      })
                    }
                  >
                    +{surplus.toString()[0]}
                  </SurplusStyle>
                )}
                total={followingsLength}
                max={4}
              >
                {followings?.map((item, index) => {
                  return (
                    <ListItem key={index} item={item} targetUser={targetUser} />
                  );
                })}
              </StyledAvatarGroup>
            ) : (
              <span
                style={{
                  color: '#888',
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                }}
              >
                No followings found!
              </span>
            )}
          </AudienceSection>
        </Container>
      )}
      {openList.active && (
        <AudienceListPopup
          openList={openList}
          setOpenList={setOpenList}
          list={openList.data}
          setList={openList.type === 'followers' ? setFollowers : setFollowings}
          user={targetUser}
          page={openList.type === 'followers' ? followersPage : followingsPage}
          setPage={
            openList.type === 'followers' ? setFollowersPage : setFollowingsPage
          }
        />
      )}
    </>
  );
};

const Container = styled.div`
  width: 100vw;
  min-height: 100%;
  box-sizing: border-box;
  gap: 0.2vw;
  padding: 15px 25px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AudienceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AudienceLabel = styled.div`
  width: 100px;
  font-size: 14px;
  color: #f866b1;
  letter-spacing: 0.5px;
  font-weight: 500;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  padding: 5px 15px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }
`;

export default Audience;

const ListItem = ({ item, targetUser }) => {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const back = useSelector((state) => state.storeApp.backPath);

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      invisible={item?.online ? false : true}
      onClick={() => {
        dispatch(setTargetUser(item));
        navigate(
          `/user/${item._id}${
            item.type === 'shop'
              ? '/showroom'
              : item.type === 'user'
              ? '/contact'
              : '/feeds'
          }`
        );
        dispatch(
          setBackPath({
            path: [...back.path, location.pathname],
            data: [...back.data, targetUser],
            activeLevel: back.activeLevel + 1,
            back: false,
          })
        );
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
        }}
      >
        {loading && (
          <BounceLoader
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            color={'#f866b1'}
            loading={loading}
            size={40}
          />
        )}

        <Avatar
          style={{
            border: '2px solid #111',
          }}
          alt={item.name}
          src={item.cover}
          onLoad={() => setLoading(false)}
        />
      </div>
    </StyledBadge>
  );
};

const StyledBadge = styled(Badge)(({}) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px #111`,
    '&::after': {
      position: 'absolute',
      top: -1,
      left: -1,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const SurplusStyle = styled.span`
  background: #f866b1; /* You can change this color */
  color: #fff;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  line-height: 40px; /* Change as per the height of avatars */
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledAvatarGroup = styled(AvatarGroup)`
  .MuiAvatarGroup-avatar {
    background: transparent !important; // Override the default background
    border: none !important; // Remove the default border
  }
`;
