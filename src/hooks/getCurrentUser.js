import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCards, setLoading, setPage } from '../redux/cards';
import {
  setNotifications,
  setUnreadNotidications,
} from '../redux/notifications';
import { setCurrentUser } from '../redux/user';

export const GetCurrentUser = () => {
  // getting feeds
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  // dispatch
  const dispatch = useDispatch();

  // current user local storage
  const user =
    localStorage.getItem('Beautyverse:currentUser') &&
    JSON.parse(localStorage.getItem('Beautyverse:currentUser'));

  // rerender user
  const rerenderCurrentUser = useSelector(
    (state) => state.storeUser.rerenderCurrentUser
  );

  const GetUser = async () => {
    try {
      // Make a request to get the current user's data from the server
      const response = await axios.get(
        `${backendUrl}/api/v1/users/${user._id}`
      );

      // Set the current user in the user's Redux store
      if (response.data.data.user) {
        localStorage.setItem(
          'Beautyverse:currentUser',
          JSON.stringify(response.data.data.user)
        );
        dispatch(setCurrentUser(response.data.data.user));

        GetNotifcations(response.data.data.user._id);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const GetNotifcations = async (userId) => {
    try {
      const response = await axios.get(
        backendUrl +
          '/api/v1/users/' +
          userId +
          '/notifications?page=1&limit=15'
      );
      dispatch(setNotifications(response.data.data.notifications));
      dispatch(
        setUnreadNotidications(
          response.data.data.notifications?.filter((i) => i.status === 'unread')
        )
      );
      dispatch(setPage(1));
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (user) {
      GetUser();
    }
  }, [rerenderCurrentUser]);
};
