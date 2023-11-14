import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Login from './login';
import { useDispatch, useSelector } from 'react-redux';
import { Dashboard } from './dashboard/dashboard';
import { setCurrentUser } from '../redux/user';

export const Admin = () => {
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('Beautyverse:currentUser'));

  const admin = useSelector((state) => state.storeUser.currentUser);

  useEffect(() => {
    dispatch(setCurrentUser(user));
  }, []);

  return <Container>{admin?.admin ? <Dashboard /> : <Login />}</Container>;
};

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  height: 88vh;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
`;
