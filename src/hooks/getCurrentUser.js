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
        const notifs = response.data.data.user?.notifications?.filter(
          (item) => item
        );
        dispatch(setNotifications(notifs));
        dispatch(
          setUnreadNotidications(
            notifs?.filter((item) => item?.status === 'unread')
          )
        );
      }
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
