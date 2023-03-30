import styled from 'styled-components';
import { GiFlexibleStar } from 'react-icons/gi';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLoadFeed } from '../redux/main';
import { setFeedScrollY, setCardsScrollY } from '../redux/scroll';
import {
  setRerenderUserList,
  setRerenderNotifications,
  setRerenderCurrentUser,
} from '../redux/rerenders';
import { IsMobile } from '../functions/isMobile';
import Badge from '@mui/material/Badge';
import { BsSearch } from 'react-icons/bs';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import Avatar from '../components/avatar';

export const Navigator = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rerenderUserList = useSelector(
    (state) => state.storeRerenders?.rerenderUserList
  );
  const rerenderNotifications = useSelector(
    (state) => state.storeRerenders?.rerenderNotifications
  );
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders?.rerenderCurrentUser
  );

  // import current user
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  // open mobile filter
  const filterOpen = useSelector((state) => state.storeMain.mobileFilter);

  // hide filter on scroll
  // const scroll = useSelector((state) => state.storeMain.scroll);

  // define mobile or desktop

  const isMobile = IsMobile();

  let active;
  if (window.location.pathname == '/') {
    active = 'main';
  } else if (window.location.pathname == '/cards') {
    active = 'cards';
  } else if (window.location.pathname == '/filtermobile') {
    active = 'filtermobile';
  } else if (window.location.pathname == '/chat') {
    active = 'chat';
  } else if (window.location.pathname == '/recomended') {
    active = 'recomended';
  } else if (
    window.location.pathname?.startsWith(`/api/v1/users/${currentUser?._id}`)
  ) {
    active = 'user';
  } else {
    active = 'main/user';
  }
  // referal of feeds wrapper div element to scrolling flexible
  const refDiv = document.getElementById('feed');

  //market filter
  const filter = useSelector((state) => state.storeMarket.filter);

  // style chat badge

  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 15,
      top: 15,
      border: `1px solid #fff`,
      padding: '0 3px',
    },
  }));
  const StyledSearchBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 10,
      top: 10,
      // border: `1px solid #fff`,
      padding: '0 3px',
    },
  }));

  // define unread messages length
  const chats = useSelector((state) => state.storeChat.userChats);
  const unreadMessages = chats?.filter(
    (item) =>
      item.lastMessageStatus === 'unread' &&
      item.lastMessageSenderId !== currentUser?._id
  );

  // define signed filter length
  const filterMobile = useSelector((state) => state.storeFilter.filter);
  let filterBadge;
  if (filterMobile !== '') {
    filterBadge = 1;
  } else {
    filterBadge = 0;
  }
  const search = useSelector((state) => state.storeFilter.search);
  let searchBadge;
  if (search !== '') {
    searchBadge = 1;
  } else {
    searchBadge = 0;
  }
  const city = useSelector((state) => state.storeFilter.cityFilter);
  let cityBadge;
  if (city !== '') {
    cityBadge = 1;
  } else {
    cityBadge = 0;
  }
  const district = useSelector((state) => state.storeFilter.districtFilter);
  let districtBadge;
  if (district !== '') {
    districtBadge = 1;
  } else {
    districtBadge = 0;
  }
  const specialist = useSelector((state) => state.storeFilter.specialist);
  let specialistBadge;
  if (!specialist) {
    specialistBadge = 1;
  } else {
    specialistBadge = 0;
  }

  const object = useSelector((state) => state.storeFilter.object);
  let objectBadge;
  if (!object) {
    objectBadge = 1;
  } else {
    objectBadge = 0;
  }

  return (
    <>
      <NavigatorContainer
        filterOpen={filterOpen}
        recomended={active === 'recomended' ? 'true' : 'false'}
      >
        <IconContainer
          className={
            active === 'main' || active === 'main/user' ? 'active' : ''
          }
        >
          <DynamicFeedIcon
            className={
              active === 'main' || active === 'main/user'
                ? 'activeIcon'
                : 'feedIcon'
            }
            style={{ fontSize: '6vw' }}
            size={22}
            onClick={
              active === 'main'
                ? async () => {
                    await window.scrollTo({ top: 0, behevoir: 'smooth' });
                    await dispatch(setRerenderUserList());
                    await dispatch(setRerenderNotifications());
                    await dispatch(setRerenderCurrentUser());
                    // dispatch(setFeedScrollY(0));
                  }
                : async () => {
                    // await dispatch(setNavigatorActive(0));
                    await dispatch(setLoadFeed(true));
                    await dispatch(setRerenderUserList());
                    await dispatch(setRerenderNotifications());
                    await dispatch(setRerenderCurrentUser());
                    // dispatch(setFeedScrollY(0));
                    navigate('/');
                    // await dispatch(setChangeFeed(true));
                  }
            }
          />
        </IconContainer>
        <IconContainer className={active == 'cards' ? 'active' : ''}>
          <SwitchAccountIcon
            className={active == 'cards' ? 'activeIcon' : 'feedIcon'}
            onClick={
              active === 'cards'
                ? async () => {
                    await window.scrollTo({ top: 0, behevoir: 'smooth' });
                    await dispatch(setRerenderUserList());
                    await dispatch(setRerenderNotifications());
                  }
                : async () => {
                    // dispatch(setCardsScrollY(0));
                    await dispatch(setRerenderUserList());
                    await dispatch(setRerenderNotifications());
                    navigate('cards');
                  }
            }
          />
        </IconContainer>
        {/* <Market>
          <ButtonBg>
            <MarketButton
              onClick={() => {
                dispatch(setNavigatorActive(1));
                navigate("/marketplace");
              }}
            >
              <MdShoppingCart className={active == 1 ? "active" : "feedIcon"} />
            </MarketButton>
          </ButtonBg>
        </Market> */}
        <IconContainer className={active == 'recomended' ? 'active' : ''}>
          <GiFlexibleStar
            className={active == 'recomended' ? 'activeIcon' : 'feedIcon'}
            onClick={
              active === 'recomended'
                ? async () => {
                    await window.scrollTo({ top: 0, behevoir: 'smooth' });
                    await dispatch(setRerenderUserList());
                    await dispatch(setRerenderNotifications());
                  }
                : async () => {
                    // dispatch(setCardsScrollY(0));
                    await dispatch(setRerenderUserList());
                    await dispatch(setRerenderNotifications());
                    navigate('recomended');
                  }
            }
          />
        </IconContainer>
        <IconContainer className={active == 'filtermobile' ? 'active' : ''}>
          <StyledSearchBadge
            badgeContent={
              filterBadge +
              searchBadge +
              cityBadge +
              districtBadge +
              specialistBadge +
              objectBadge
            }
            overlap="circular"
            color="secondary"
          >
            <BsSearch
              className={active == 'filtermobile' ? 'activeIcon' : 'feedIcon'}
              onClick={() => {
                // dispatch(setNavigatorActive(2));
                navigate('filtermobile');
              }}
              size={20}
            />
          </StyledSearchBadge>
        </IconContainer>
        {/* <IconContainer
          className={active == 'chat' ? 'active' : ''}
          onClick={() => {
            // dispatch(setNavigatorActive(3));
            navigate('chat');
          }}
        >
          {unreadMessages?.length > 0 ? (
            <StyledBadge
              badgeContent={unreadMessages?.length}
              overlap="circular"
              color="secondary"
            >
              <HiChatAlt
                className={active == 'chat' ? 'activeIcon' : 'feedIcon'}
                size={24}
              />
            </StyledBadge>
          ) : (
            <HiChatAlt
              className={active == 'chat' ? 'activeIcon' : 'feedIcon'}
              size={24}
            />
          )}
        </IconContainer> */}
        <Link
          to={(() => {
            if (!currentUser) {
              return '/login';
            } else if (currentUser?.type === 'user') {
              return `/api/v1/users/${currentUser?._id}/contact`;
            } else {
              return `/api/v1/users/${currentUser?._id}`;
            }
          })()}
          style={{
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Profile active={active?.toString()}>
            <Avatar
              alt={currentUser?.name}
              link={currentUser?.cover ? currentUser?.cover : ''}
              size="small"
            />
          </Profile>
        </Link>
      </NavigatorContainer>
    </>
  );
};

const NavigatorContainer = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    width: 100vw;
    padding: 0 4vw 0 3vw;
    // border-top: 1px solid ${(props) => props.theme.secondLevel};
    height: 11vw;
    overflow: hidden;
    position: fixed;
    justify-content: space-between;
    box-sizing: border-box;
    bottom: 0;
    align-items: center;
    z-index: 90;
    backdrop-filter: blur(20px);
    background: ${(props) => props.theme.header};
  }

  .active {
    border-top: 2px solid #2bdfd9;
  }
`;

const IconContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  border-top: 3px solid rgba(0, 0, 0, 0);
  .filter {
    display: none;
    @media only screen and (max-width: 600px) {
      display: flex;
      font-size: 6vw;
      cursor: pointer;
      margin-right: 1vw;
      color: ${(props) => props.theme.secondLevel};

      color: linear-gradient(
        0deg,
        rgba(32, 218, 169, 1) 0%,
        rgba(196, 16, 215, 1) 50%,
        rgba(0, 212, 255, 1) 100%
      );
      transition: ease 200ms;
    }
  }

  .listIcon {
    font-size: 1.1vw;
    color: linear-gradient(90deg, red, green);
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 5.5vw;

      padding: 2vw;
      margin: 0;
    }
  }
  .feedIcon {
    font-size: 1.1vw;
    color: ${(props) => props.theme.icon};
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      // height: 9vw;
      font-size: 5vw;
      padding: 2vw;
      margin: 0;
    }
  }
  .activeIcon {
    font-size: 1.1vw;
    color: #2bdfd9;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      // height: 9vw;
      font-size: 5vw;
      padding: 2vw;
      margin: 0;
    }
  }

  .productIcon {
    @media only screen and (max-width: 600px) {
      font-size: 5vw;
      color: #ccc;
      margin-right: 3vw;
      cursor: pointer;
    }
  }
`;

const Changer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.3vw;
  padding: 1vw;
  flex: 1;

  @media only screen and (max-width: 600px) {
    height: 10vw;
    gap: 0.3vw;
  }
`;

const Market = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    align-items: center;
  }
`;

const MarketButton = styled.div`
  padding: 0.55vw 1.5vw 0.55vw 1.5vw;
  border-radius: 0.5vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1vw;
  color: white;
  font-size: 3.5vw;
  font-weight: bold;
  cursor: pointer;
  color: ${(props) => props.theme.secondLevel};
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    padding: 0;
    gap: 0;
  }
`;

const ButtonBg = styled.div`
  box-sizing: border-box;
  padding: 0.7vw 0.7vw 0.7vw 0.8vw;
  border-radius: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  @media only screen and (max-width: 600px) {
    padding: 0;
  }

  // background: linear-gradient(323deg, #438ee4, #c743e4, #e4b643, #43e457);
  background: none;
  background-size: 800% 800%;

  -webkit-animation: AnimationName 5s ease infinite;
  -moz-animation: AnimationName 5s ease infinite;
  animation: AnimationName 5s ease infinite;

  @-webkit-keyframes AnimationName {
    0% {
      background-position: 7% 0%;
    }
    50% {
      background-position: 94% 100%;
    }
    100% {
      background-position: 7% 0%;
    }
  }
  @-moz-keyframes AnimationName {
    0% {
      background-position: 7% 0%;
    }
    50% {
      background-position: 94% 100%;
    }
    100% {
      background-position: 7% 0%;
    }
  }
  @keyframes AnimationName {
    0% {
      background-position: 7% 0%;
    }
    50% {
      background-position: 94% 100%;
    }
    100% {
      background-position: 7% 0%;
    }
  }
`;

const Profile = styled.div`
  width: auto;
  height: auto;
  border-radius: 50%;

  @media only screen and (max-width: 600px) {
    border: 2px solid
      ${(props) => (props.active === 'user' ? '#2bdfd9' : props.theme.font)};
  }

  :hover {
    filter: brightness(1);
  }
`;
