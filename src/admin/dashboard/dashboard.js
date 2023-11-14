import React, { useState } from 'react';
import styled from 'styled-components';
import Login from '../login';
import { useDispatch, useSelector } from 'react-redux';
import DashboardList from './dashboardList';
import { DoorBack, Logout } from '@mui/icons-material';
import { setCurrentUser } from '../../redux/user';
import { Users } from './users';
import { Feeds } from './feeds';
import { Analytics } from './analytics';
import { Corrector } from './corrector';
import { Reports } from './reports';
import { SendNotifications } from './sendNotifications';
import { SendEmails } from './sendEmails';
import { Team } from './team';
import { Partners } from './partners';
import { Financial } from './financial';
import { Inbox } from './inbox';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const [activeState, setActiveState] = useState('Users');
  return (
    <Container>
      <div
        style={{
          color: '#f866b1',
          fontSize: '16px',
          fontWeight: 500,
          letterSpacing: '0.5px',
          position: 'absolute',
          right: '30px',
          top: '40px',
          zIndex: '10000',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          cursor: 'pointer',
        }}
        onClick={() => {
          localStorage.removeItem('Beautyverse:currentUser');
          dispatch(setCurrentUser(null));
        }}
      >
        <Logout />
        Log Out
      </div>
      <Wrapper>
        <DashboardList
          setActiveState={setActiveState}
          activeState={activeState}
        />
        <div
          style={{
            boxSizing: 'border-box',
            width: '100%',
            height: '100%',
            padding: '15px 15px 15px 0',
          }}
        >
          {activeState === 'Users' && <Users />}
          {activeState === 'Feeds' && <Feeds />}
          {activeState === 'Analytics' && <Analytics />}
          {activeState === 'Corrector' && <Corrector />}
          {activeState === 'Reports' && <Reports />}
          {activeState === 'Send Notifications' && <SendNotifications />}
          {activeState === 'Send Emails' && <SendEmails />}
          {activeState === 'Team' && <Team />}
          {activeState === 'Partners' && <Partners />}
          {activeState === 'Financial' && <Financial />}
          {activeState === 'Inbox' && <Inbox />}
        </div>
      </Wrapper>
    </Container>
  );
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
  display: flex;
`;
