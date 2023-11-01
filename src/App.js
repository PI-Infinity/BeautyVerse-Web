import React, { useEffect, useState } from 'react';
import { Header } from './components/header';
import styled from 'styled-components';
import { Routers } from './routers/router-main';
import { BottomTabNavigator } from './components/bottomTabNavigator';
import { useLocation } from 'react-router-dom';
import HeadRoom from 'react-headroom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLoading, setMachineId } from './redux/app';
import { GetFeeds } from './hooks/getFeeds';
import { GetCards } from './hooks/getCards';
import { GetProducts } from './hooks/getProducts';
import { GetCurrentUser } from './hooks/getCurrentUser';

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
   * Define machine unique id
   */
  useEffect(() => {
    const GetMachineId = async () => {
      try {
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

  return (
    <Container>
      {/** getting datas */}
      <GetCurrentUser />
      <GetFeeds />
      <GetCards />
      <GetProducts />
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
      {location.pathname !== '/' && <BottomTabNavigator />}
    </Container>
  );
};

export default App;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
