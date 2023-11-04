import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CgFeed } from 'react-icons/cg';
import { BiUserPin } from 'react-icons/bi';
import { RiShoppingBag2Fill } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setRerenderFeeds, setScrollYFeeds } from '../redux/feeds';
import { setRerenderCards, setScrollYCards } from '../redux/cards';
import { setBackPath, setScrollToTop } from '../redux/app';
import {
  setRerenderMarketplace,
  setScrollYMarketplace,
} from '../redux/marketplace';
import { setRerenderCurrentUser, setScrollYUser } from '../redux/user';
import axios from 'axios';
import { setRerenderNotifications } from '../redux/notifications';
import { BounceLoader } from 'react-spinners';

export const BottomTabNavigator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // pages scroll y
  const scrollYFeeds = useSelector((state) => state.storeFeeds.scrollY);
  const scrollYCards = useSelector((state) => state.storeCards.scrollY);
  const scrollYMarketplace = useSelector(
    (state) => state.storeMarketplace.scrollY
  );
  const scrollYUser = useSelector((state) => state.storeUser.scrollY);

  // current user states
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // profile cover loading
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!loading) {
      setLoading(true);
    }
  }, [currentUser?.cover]);

  const backPath = useSelector((state) => state.storeApp.backPath);

  return (
    <Container>
      <div
        onClick={() => {
          if (location.pathname === '/feeds') {
            if (scrollYFeeds > 0) {
              dispatch(setScrollToTop());
              dispatch(setScrollYFeeds(0));
            } else {
              dispatch(setRerenderFeeds());
            }
          } else {
            navigate('/feeds');
          }
        }}
      >
        <CgFeed
          size={30}
          color={
            window.location.pathname.startsWith('/feeds') ? '#f866b1' : '#ccc'
          }
        />
      </div>
      <div
        onClick={() => {
          if (location.pathname === '/cards') {
            if (scrollYCards > 0) {
              console.log('this run');
              dispatch(setScrollToTop());
              dispatch(setScrollYCards(0));
            } else {
              dispatch(setRerenderCards());
            }
          } else {
            navigate('/cards');
          }
        }}
      >
        <BiUserPin
          size={28}
          color={
            window.location.pathname.startsWith('/cards') ? '#f866b1' : '#ccc'
          }
        />
      </div>
      <div
        onClick={() => {
          if (location.pathname === '/marketplace') {
            if (scrollYMarketplace > 0) {
              dispatch(setScrollToTop());
              dispatch(setScrollYMarketplace(0));
            } else {
              dispatch(setRerenderMarketplace());
            }
          } else {
            navigate('/marketplace');
          }
        }}
      >
        <RiShoppingBag2Fill
          size={23}
          color={
            window.location.pathname.startsWith('/marketplace')
              ? '#f866b1'
              : '#ccc'
          }
        />
      </div>
      <div
        onClick={() => {
          if (
            location.pathname?.includes('notifications') ||
            location.pathname?.includes('settings') ||
            location.pathname?.includes('addfeed')
          ) {
            navigate(
              `/profile/${
                currentUser?.type === 'shop'
                  ? 'showroom'
                  : currentUser?.type === 'user'
                  ? 'contact'
                  : 'feeds'
              }`
            );
          } else if (location.pathname?.includes('/profile')) {
            if (scrollYUser === 0) {
              dispatch(setRerenderCurrentUser());
            } else {
              dispatch(setScrollToTop());
              dispatch(setScrollYUser(0));
            }
          } else {
            if (currentUser) {
              dispatch(
                setBackPath({
                  path: [location.pathname],
                  data: [],
                  activeLevel: 0,
                })
              );
              navigate(
                `/profile/${
                  currentUser?.type === 'shop'
                    ? 'showroom'
                    : currentUser?.type === 'user'
                    ? 'contact'
                    : 'feeds'
                }`
              );
            } else {
              navigate('/login');
            }
          }
        }}
      >
        {currentUser?.cover?.length > 0 ? (
          <>
            {loading && (
              <BounceLoader
                style={{ position: 'absolute' }}
                size={25}
                loading={loading}
                color="#f866b1"
              />
            )}

            <img
              key={currentUser?.cover}
              src={`${currentUser?.cover + '?' + new Date().getTime()}`}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50px',
                border: `1.5px solid ${
                  window.location.pathname.startsWith('/profile')
                    ? '#f866b1'
                    : '#ccc'
                }`,
                objectFit: 'cover',
              }}
              onLoad={() => setLoading(false)}
            />
          </>
        ) : (
          <FaUserCircle
            size="22px"
            color={
              window.location.pathname.startsWith('/profile') ||
              window.location.pathname.includes('/register') ||
              window.location.pathname.startsWith('/login')
                ? '#f866b1'
                : '#ccc'
            }
          />
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 10;
  height: 6vh;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 8vw;
  background: rgba(1, 2, 12, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1.5px solid rgba(255, 255, 255, 0.1);
`;
