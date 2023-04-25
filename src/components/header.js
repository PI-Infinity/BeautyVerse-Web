import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BiMessageSquareAdd } from 'react-icons/bi';
import { setFeedScrollY } from '../redux/scroll';
import {
  setRerenderUserList,
  setRerenderNotifications,
  setRerenderCurrentUser,
} from '../redux/rerenders';
import { setUserListClear } from '../redux/main';
import Menu from '../components/menu';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Badge from '@mui/material/Badge';
import { IsMobile } from '../functions/isMobile';
import Avatar from '@mui/material/Avatar';
import Notifications from '../components/notifications';

export const Header = (props) => {
  const isMobile = IsMobile();
  React.useEffect(() => {
    dispatch(setRerenderCurrentUser());
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const openMenu = useSelector((state) => state.storeMain.openMenu);
  const openMobileMenu = useSelector((state) => state.storeMain.openMobileMenu);
  const userList = useSelector((state) => state.storeMain.userList);

  // import current user from redux state
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const cover = useSelector((state) => state.storeMain.coverUrl);
  const [coverUrl, setCoverUrl] = useState();

  useEffect(() => {
    // Update the cover image whenever coverUrl changes
    if (cover) {
      setCoverUrl(cover);
    }
  }, [cover]);

  const getCoverImageSrc = () => {
    if (coverUrl) {
      return coverUrl;
    } else if (currentUser && currentUser.cover) {
      return currentUser.cover;
    } else {
      return '';
    }
  };

  const rerenderNotifications = useSelector(
    (state) => state.storeRerenders?.rerenderNotifications
  );
  const rerenderUserList = useSelector(
    (state) => state.storeRerenders?.rerenderUserList
  );
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders?.rerenderCurrentUser
  );

  // styled badge for menu

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 20,
      top: 5,
      padding: '0',
    },
  }));

  const notifLength = currentUser?.notifications?.filter(
    (item) => item?.status === 'unread'
  );

  // open notifs
  const [openNotifications, setOpenNotifications] = useState(false);

  // define unread messages length
  const [chats, setChats] = React.useState([]);

  // user destination
  let userDestination;
  if (currentUser?.type === 'user') {
    if (isMobile) {
      userDestination = `/api/v1/users/${currentUser?._id}/contact`;
    } else {
      userDestination = `/api/v1/users/${currentUser?._id}/audience`;
    }
  } else {
    userDestination = `/api/v1/users/${currentUser?._id}`;
  }

  return (
    <>
      {openNotifications && (
        <Notifications
          open={openNotifications}
          setOpen={setOpenNotifications}
          title="Notifications"
          button="Close"
        />
      )}
      <Container isMobile={isMobile}>
        <Divider>
          <div
            onClick={
              window.location.pathname != '/'
                ? async () => {
                    await props.setPage(1);
                    await dispatch(setUserListClear());
                    await dispatch(setRerenderUserList());
                    dispatch(setRerenderCurrentUser());
                    navigate('/');
                    // dispatch(setFeedScrollY(0));
                  }
                : async () => {
                    await props.setPage(1);
                    await dispatch(setUserListClear());
                    await dispatch(setRerenderUserList());
                    dispatch(setRerenderCurrentUser());
                    // dispatch(setFeedScrollY(0));
                  }
            }
            className="logoLink"
          >
            <Title>Beauty</Title>
            <Title2>verse</Title2>
          </div>
          <Divider style={{ justifyContent: 'start', flex: 2 }} empty={true}>
            {/* <BsStars className="logo" onClick={() => navigate("/")} /> */}
          </Divider>
        </Divider>
        <Divider style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
          {!isMobile && currentUser && (
            <div
              style={{
                marginRight: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: '100%',
                marginTop: '3px',
              }}
            >
              {currentUser?.type !== 'user' && (
                <BiMessageSquareAdd
                  className="notifIcon"
                  size={24}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/add')}
                />
              )}
              {/* {chats > 0 ? (
                <Badge badgeContent={chats} color="secondary">
                  <HiChatAlt
                    className="notifIcon"
                    size={24}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/chat')}
                  />
                </Badge>
              ) : (
                <HiChatAlt
                  className="notifIcon"
                  size={24}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/chat')}
                />
              )} */}
            </div>
          )}
          <Link
            to={currentUser ? userDestination : '/login'}
            style={{
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Profile>
              <Avatar
                alt={currentUser?.name}
                src={getCoverImageSrc()}
                sx={{ width: 36, height: 36 }}
              />
            </Profile>
          </Link>

          {notifLength?.length > 0 ? (
            <StyledBadge
              badgeContent={notifLength?.length}
              overlap="circular"
              color="secondary"
            >
              <Menu
                setOpenTerms={props.setOpenTerms}
                setOpenPrivacy={props.setOpenPrivacy}
                setOpenUsage={props.setOpenUsage}
                setOpenQA={props.setOpenQA}
                notifLength={notifLength?.length}
                open={openNotifications}
                setOpen={setOpenNotifications}
              />
            </StyledBadge>
          ) : (
            <Menu
              setOpenTerms={props.setOpenTerms}
              setOpenPrivacy={props.setOpenPrivacy}
              setOpenUsage={props.setOpenUsage}
              setOpenUsage={props.setOpenUsage}
              setOpenQA={props.setOpenQA}
              notifLength={notifLength?.length}
              open={openNotifications}
              setOpen={setOpenNotifications}
            />
          )}
        </Divider>
      </Container>
    </>
  );
};

const Container = styled.header`
  position: fixed;
  width: 100%;
  background: ${(props) => props.theme.background};
  height: 3vw;
  top: 0.2vw;
  left: 0;
  right: auto;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2vw 0.2vw 2vw;
  z-index: 1000;
  overflow: hidden;
  box-sizing: border-box;

  .logoLink {
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    text-decoration: none;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      margin-left: 4vw;
    }
  }

  @media only screen and (max-width: 600px) {
    position: static;
    z-index: 1000;
    flex-shrink: 0;
    top: 0;
    left: 0;
    height: 12vw;
    border-bottom: 0px solid #ddd;
    padding: 0;
    backdrop-filter: blur(20px);
    background: ${(props) => props.theme.header};
    box-sizing: border-box;
    // tried those
    -webkit-flex-shrink: 0;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    -ms-flex-negative: 0;
  }
`;

const Divider = styled.div`
  flex: 2;
  display: ${(props) => (props.empty ? 'none' : 'flex')};
  align-items: center;

  .logo {
    font-size: 1.7vw;
    margin-left: 3vw;
    color: ${(props) => props.theme.logo};

    @media only screen and (max-width: 600px) {
      font-size: 6.5vw;
      margin-right: 1vw;
    }
  }
  @media only screen and (max-width: 600px) {
    display: flex;
  }

  .chatIcon {
    font-size: 1.4vw;
    margin-right: 0.7vw;
    margin-top: 0.2vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      margin-right: 3vw;
    }
  }

  .userIcon {
    font-size: 1.6vw;
    margin-right: 0.3vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      margin-right: 1vw;
    }
  }
  .notifIcon {
    font-size: 1.7vw;
    color: ${(props) => props.theme.icon};

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }
  }
  .menuIcon {
    // margin-left: 0.5vw;
    font-size: 1.7vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 7vw;
      margin: 0;
    }
  }
  .ClosemenuIcon {
    margin-left: 0.5vw;
    font-size: 1.7vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 7vw;
      margin: 0;
    }
  }
`;

const Title = styled.span`
  font-size: 1.5vw;
  font-weight: bold;
  padding: 0;
  background: ${(props) => props.theme.logo};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media only screen and (max-width: 600px) {
    font-size: 6vw;
    letter-spacing: 0.1vw;
    position: relative;
    bottom: 0.2vw;
    padding: 0;
    margin: 0;
  }
`;
const Title2 = styled.span`
  font-size: 1.5vw;
  color: ${(props) => props.theme.logo2};

  @media only screen and (max-width: 600px) {
    font-size: 6vw;
    letter-spacing: 0.1vw;
    position: relative;
    bottom: 0.2vw;
  }
`;

const Profile = styled.div`
  width: 1.6vw;
  height: 1.6vw;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  z-index: 7;
  margin-right: 0.5vw;
  margin-top: 0.1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.9);
  transition: ease-in-out 200ms;

  animation: fadeIn 0.5s;
  -webkit-animation: fadeIn 0.5s;
  -moz-animation: fadeIn 0.5s;
  -o-animation: fadeIn 0.5s;
  -ms-animation: fadeIn 0.5s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 600px) {
    display: none;
  }

  .user {
    border: 1px solid #ccc;
    padding: 0.2vw;
    border-radius: 50%;
    color: #ccc;
    font-size: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
      border: 2px solid #ccc;
      padding: 0.6vw;
    }
  }
`;

const Img = styled.img`
  width: 1.8vw;
  height: 1.8vw;
  cursor: pointer;
  object-fit: cover;

  @media only screen and (max-width: 600px) {
    width: 7vw;
    height: 7vw;
  }
`;
