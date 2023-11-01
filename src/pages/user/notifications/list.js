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
