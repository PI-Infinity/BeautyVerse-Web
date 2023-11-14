import React, { useState } from 'react';
import styled from 'styled-components';

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [activeCountry, setActiveCountry] = useState('Georgia');
  return (
    <Container>
      <div
        style={{
          fontSize: '18px',
          fontWeight: '500',
          letterSpacing: '0.75px',
          color: '#ccc',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <div style={{ color: '#ccc', fontSize: '24px' }}>
          Total Users: <span style={{ color: '#f866b1' }}>30</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ color: '#888' }}>Users by country:</div>
          <div
            style={{
              padding: '5px 20px',
              borderRadius: '50px',
              border: '1.5px solid rgba(255,255,255,0.1)',
            }}
            onClick={() => setActiveCountry('Georgia')}
          >
            Georgia: <span style={{ color: '#f866b1' }}>10</span>
          </div>
          <div
            style={{
              padding: '5px 20px',
              borderRadius: '50px',
              border: '1.5px solid rgba(255,255,255,0.1)',
            }}
            onClick={() => setActiveCountry('Russia')}
          >
            Russia: <span style={{ color: '#f866b1' }}>5</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ color: '#888' }}>Users by type:</div>
          <div
            style={{
              padding: '5px 20px',
              borderRadius: '50px',
              border: '1.5px solid rgba(255,255,255,0.1)',
            }}
          >
            Users: <span style={{ color: '#f866b1' }}>10</span>
          </div>
          <div
            style={{
              padding: '5px 20px',
              borderRadius: '50px',
              border: '1.5px solid rgba(255,255,255,0.1)',
            }}
          >
            Specialists: <span style={{ color: '#f866b1' }}>5</span>
          </div>
          <div
            style={{
              padding: '5px 20px',
              borderRadius: '50px',
              border: '1.5px solid rgba(255,255,255,0.1)',
            }}
          >
            Beauty Salons: <span style={{ color: '#f866b1' }}>8</span>
          </div>
          <div
            style={{
              padding: '5px 20px',
              borderRadius: '50px',
              border: '1.5px solid rgba(255,255,255,0.1)',
            }}
          >
            Shops: <span style={{ color: '#f866b1' }}>7</span>
          </div>
        </div>
      </div>
      <div>
        {users?.map((item, index) => {
          return <div key={index}>{item?.name}</div>;
        })}
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 20px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
`;
