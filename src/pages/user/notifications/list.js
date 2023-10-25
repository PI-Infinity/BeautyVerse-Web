import React from 'react';
import styled from 'styled-components';
import { NotificationItem } from './item';
import { useSelector } from 'react-redux';
import { setNotifications } from '../../../redux/notifications';

export const List = ({ currentUser, setOpenConfig }) => {
  // notifications
  const list = useSelector((state) => state.storeNotifications.notifications);
  return (
    <Container>
      {list?.map((item, index) => {
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
      })}
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
