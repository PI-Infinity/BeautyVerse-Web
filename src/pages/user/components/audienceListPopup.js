import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import { IoMdArrowDropdown } from 'react-icons/io';
import { FeedCard } from '../../feeds/components/feedCard';
import { setTargetUser } from '../../../redux/user';
import { setBackPath } from '../../../redux/app';
import { Avatar } from '@mui/material';
import Badge from '@mui/material/Badge';
import { BounceLoader } from 'react-spinners';

export const AudienceListPopup = ({
  openList,
  setOpenList,
  list,
  setList,
  page,
  setPage,
  user,
}) => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();
  // dispatch
  const dispatch = useDispatch();

  // add audience on scrolling
  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const AddAudience = async () => {
    try {
      const response = await axios.get(
        backendUrl +
          `/api/v1/users/${user?._id}/${openList.type}?page=${
            page + 1
          }&limit=10`
      );

      if (response.data.data) {
        setPage(page + 1);
        setList((prev) => {
          const newUsers =
            openList.type === 'followings'
              ? response.data.data.followings
              : response.data.data.followers;
          return newUsers.reduce((acc, curr) => {
            const existingUserIndex = acc.findIndex(
              (user) => user._id === curr._id
            );
            if (existingUserIndex !== -1) {
              // User already exists, merge the data
              const mergedUser = { ...acc[existingUserIndex], ...curr };
              return [
                ...acc.slice(0, existingUserIndex),
                mergedUser,
                ...acc.slice(existingUserIndex + 1),
              ];
            } else {
              // User doesn't exist, add to the end of the array
              return [...acc, curr];
            }
          }, prev);
        });
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      //   dispatch(setScrollYFeeds(scrollY));

      if (scrollY + innerHeight >= scrollHeight - 200) {
        await AddAudience(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page]);

  const back = useSelector((state) => state.storeApp.backPath);

  // capitalize first letters function
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  let Title = capitalizeFirstLetter(openList.type);

  // list filter
  const [filter, setFilter] = useState('');

  const [transition, setTransition] = useState(true);
  useEffect(() => {
    setTransition(false);
  }, []);

  return (
    <div
      style={{
        background: 'rgba(1, 2, 12, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1001,
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: '0',
        left: '0',
      }}
    >
      <Container transition={transition ? 'true' : 'false'}>
        <Header>
          <div style={{ width: '30px' }}></div>
          <div>
            <h3
              style={{
                color: '#ccc',
                margin: 0,
                padding: 0,
                letterSpacing: '0.5px',
              }}
            >
              {Title}
            </h3>
          </div>
          <div
            onClick={() => {
              setTransition(true);
              setTimeout(() => {
                setOpenList({ type: '', active: false, data: {} });
              }, 300);
            }}
            style={{
              padding: '5px',

              zIndex: 1000,
            }}
          >
            <IoMdArrowDropdown size={30} color="#f866b1" />
          </div>
        </Header>
        <Navigator filter={filter} setFilter={setFilter} />
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '15px 20px',
            boxSizing: 'border-box',
          }}
        >
          {list?.filter((i) =>
            i?.type?.toLowerCase().includes(filter?.toLowerCase())
          )?.length > 0 ? (
            list
              ?.filter((i) =>
                i?.type?.toLowerCase().includes(filter?.toLowerCase())
              )
              ?.map((item, index) => {
                // capitalize and define user's type
                const t = item?.username
                  ? item?.username
                  : capitalizeFirstLetter(item?.type);
                return (
                  <div
                    key={index}
                    style={{
                      color: '#ccc',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '0.5px',
                      gap: '10px',
                    }}
                  >
                    <ItemCover item={item} />
                    <h4
                      style={{ whiteSpace: 'nowrap' }}
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
                            data: [...back.data, user],
                            activeLevel: back.activeLevel + 1,
                            back: false,
                          })
                        );
                      }}
                    >
                      {item.name}
                    </h4>
                    <h4
                      style={{
                        color: '#888',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        fontSize: '14px',
                      }}
                    >
                      {t === 'Beautycenter' ? 'Beauty Salon' : t}
                    </h4>
                  </div>
                );
              })
          ) : (
            <div
              style={{
                width: '100vw',
                height: '300px',
                color: 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                letterSpacing: '0.5px',
                fontWeight: 500,
              }}
            >
              Not found!
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100%;
  padding: 0 0 50px 0;
  z-index: 1000;
  background: rgba(1, 2, 12, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: ease-in 300ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  position: fixed;
  top: ${(props) => (props.transition === 'true' ? '100vh' : '0')};
  left: 0;
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemCover = ({ item, user }) => {
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
            data: [...back.data, user],
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
          borderRadius: '50vw',
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

// list filter navigator

const Navigator = ({ setFilter, filter }) => {
  let categories = ['Specialist', 'Beautycenter', 'Shop', 'User'];

  // Convert the array to a Set to eliminate duplicates, then convert it back to an array
  categories = [...new Set(categories)];

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        width: '90vw',
        overflowX: 'scroll',
      }}
    >
      <div
        onClick={() => setFilter('')}
        style={{
          color: '#ccc',
          width: '200px',
          whiteSpace: 'nowrap',
          borderRadius: '50px',
          padding: '5px 10px',
          border:
            filter === '' ? '1.5px solid #f866b1' : '1.5px solid rgba(0,0,0,0)',
        }}
      >
        All
      </div>
      {categories?.map((item, index) => {
        return (
          <div
            onClick={() => setFilter(item)}
            key={index}
            style={{
              color: '#ccc',
              width: '200px',
              whiteSpace: 'nowrap',
              borderRadius: '50px',
              padding: '5px 10px',
              border:
                item === filter
                  ? '1.5px solid #f866b1'
                  : '1.5px solid rgba(0,0,0,0)',
              fontSize: '14px',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}
          >
            {item === 'Beautycenter' ? 'Beauty Salon' : item}
          </div>
        );
      })}
    </div>
  );
};
