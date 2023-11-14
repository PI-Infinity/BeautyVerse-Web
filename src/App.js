import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Header } from './components/header';
import styled from 'styled-components';
import { Routers } from './routers/router-main';
import { useLocation } from 'react-router-dom';
import HeadRoom from 'react-headroom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLanguage, setLoading, setMachineId } from './redux/app';
import { GetFeeds } from './hooks/getFeeds';
import { GetCards } from './hooks/getCards';
import { GetProducts } from './hooks/getProducts';
import { GetCurrentUser } from './hooks/getCurrentUser';
import { BounceLoader } from 'react-spinners';
import { useDeviceType } from './functions/device';

const BottomTabNavigator = lazy(() =>
  import('./components/bottomTabNavigator')
);

/**
 *
 * @returns Main content component in BeautyVerse Web
 * Used styled-components for styling
 * App component is rendered in index.js file
 */

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Define machine unique id && add app language
   */
  useEffect(() => {
    const GetMachineId = async () => {
      try {
        const lang = localStorage.getItem('Beautyverse:language');
        dispatch(setLanguage(lang || 'en'));
        const response = await axios.get(backendUrl + '/machineId');
        // dave id in redux
        dispatch(setMachineId(response.data));
      } catch (error) {
        console.log(error.response);
      }
    };
    GetMachineId();
  }, []);

  /**
   * define user's last visit date
   */
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  useEffect(() => {
    const GetLastVisit = async () => {
      try {
        await axios.patch(`${backendUrl}/api/v1/users/${currentUser?._id}`, {
          lastLoginAt: new Date(),
        });
      } catch (error) {
        console.log(error.response);
      }
    };
    if (currentUser) {
      GetLastVisit();
    }
  }, []);

  // ios open app request

  useEffect(() => {
    if (window.location.search.includes('openiosapp')) {
      window.location.href = 'beautyverse://' + window.location.search;
    }
  }, []); //

  /////

  const LoadingFallback = () => (
    <div
      style={{
        width: '100vw',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BounceLoader size={50} color="#f866b1" />;
    </div>
  );

  // device type
  const device = useDeviceType();

  return (
    <>
      <Container>
        {device === 'Mobile' && (
          <>
            {/** getting datas */}
            <GetCurrentUser />
            <GetFeeds />
            <GetCards />
            <GetProducts />
          </>
        )}
        {/** Main header of the app */}
        {!location.pathname.includes('user') &&
          !location.pathname.includes('/marketplace/search') &&
          !location.pathname.includes('/profile') &&
          !location.pathname.includes('/visit') && (
            <HeadRoom
              downTolerance={10}
              upTolerance={10}
              styles={{ zIndex: 1000 }}
            >
              <Header />
            </HeadRoom>
          )}
        {/** Routers of the app */}

        <Routers />
        {/** Bottom tab navigator */}
        {location.pathname !== '/' && device === 'Mobile' && (
          <Suspense fallback={<LoadingFallback />}>
            <BottomTabNavigator />
          </Suspense>
        )}
      </Container>
    </>
  );
};

export default App;

const Container = styled.div`
  display: inline;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
