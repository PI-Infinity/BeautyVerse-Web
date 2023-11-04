import React, { useEffect } from 'react';
import styled from 'styled-components';
import { NotificationItem } from './item';
import { useDispatch, useSelector } from 'react-redux';
import {
  addNotifications,
  addUnreadNotifications,
  setNotifications,
  setPage,
} from '../../../redux/notifications';
import axios from 'axios';

export const List = ({ currentUser, setOpenConfig }) => {
  const dispatch = useDispatch();
  // notifications
  const list = useSelector((state) => state.storeNotifications.notifications);
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  const page = useSelector((state) => state.storeNotifications.page);

  const AddNotifcations = async (p) => {
    try {
      const response = await axios.get(
        backendUrl +
          '/api/v1/users/' +
          currentUser?._id +
          `/notifications?page=${p}&limit=15`
      );
      if (response.data.data.notifications) {
        dispatch(addNotifications(response.data.data.notifications));
        dispatch(
          addUnreadNotifications(
            response.data.data.notifications?.filter(
              (i) => i.status === 'unread'
            )
          )
        );
        dispatch(setPage(p));
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      if (scrollY + innerHeight >= scrollHeight - 200) {
        await AddNotifcations(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page]);

  return (
    <Container>
      {list?.length > 0 ? (
        list?.map((item, index) => {
          if (item) {
            return (
              <NotificationItem
                item={item}
                key={index}
                currentUser={currentUser}
                setOpenConfig={setOpenConfig}
              />
            );
          }
        })
      ) : (
        <div
          style={{
            color: '#888',
            margin: '35vh 0 0 0',
            letterSpacing: '0.5px',
            fontWeight: 500,
          }}
        >
          Notifications not found!
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 8px;
`;
