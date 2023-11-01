import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Header } from '../../pages/user/components/headerProfile';
import { CoverSection } from '../../pages/user/components/coverSection';
import { useDispatch, useSelector } from 'react-redux';
import { Navigator } from '../../pages/user/components/navigator';
import { useLocation, Outlet } from 'react-router-dom';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import { setLoading, setScrollYUser } from '../../redux/user';
import Headroom from 'react-headroom';
import { setBackPath } from '../../redux/app';

const UserProfile = () => {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  // loading state
  const loading = useSelector((state) => state.storeUser.loading);

  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // page animation transition
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    setTransition(true);
  }, []);

  // scroll to top
  const scrollToTop = useSelector((state) => state.storeApp.scrollToTop);
  const firstLoadScroll = useRef(true);
  useEffect(() => {
    if (firstLoadScroll.current) {
      firstLoadScroll.current = false;
      return;
    }
    // Perform some action when scrollToTop is true
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // other logic you want to perform when scrollToTop changes
  }, [scrollToTop]);

  // refresh indicator
  const [refresh, setRefresh] = useState(false);
  const rerenderCurrentUser = useSelector(
    (state) => state.storeUser.rerenderCurrentUser
  );
  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  }, [rerenderCurrentUser]);

  return (
    <>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(1, 2, 12, 0.9)', // Changed from 'background'
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)', // Changed from '-webkit-backdrop-filter' to follow camelCase convention
            zIndex: 1005,
          }}
        >
          <BounceLoader color={'#f866b1'} loading={loading} size={50} />
        </div>
      )}
      <Container transition={transition ? 'true' : 'false'}>
        <>
          <Headroom
            downTolerance={10}
            upTolerance={10}
            styles={{ zIndex: 1000 }}
          >
            <Header user={currentUser} />
          </Headroom>

          <div
            style={{
              height: refresh ? '60px' : 0,
              opacity: refresh ? 1 : 0,
              width: '100%',
              transition: 'ease-in-out 300ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BounceLoader color={'#f866b1'} loading={refresh} size={30} />
          </div>

          <CoverSection user={currentUser} />
          <Navigator user={currentUser} />

          <Outlet context={[currentUser]} />
        </>
      </Container>
    </>
  );
};

export default UserProfile;

const Container = styled.div`
  min-height: 100vh;
  padding-bottom: 50px;
  overflow: hidden;
  position: relative;
  right: ${(props) => (props.transition === 'true' ? 0 : '-100vw')};
  opacity: ${(props) => (props.transition === 'true' ? '1' : '0')};
  transition: ease-in-out 200ms;

  ::-webkit-scrollbar {
    display: none !important;
  }
`;
