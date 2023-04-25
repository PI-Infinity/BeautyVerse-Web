import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CostumizedList from '../../pages/adminDashboard/categoryList';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
  document.body.style.overflowY = 'hidden';

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const response = await axios.get(
          'https://beautyverse.herokuapp.com/api/v1/users'
        );
        setUsers(response.data.data.users);
        setStats(response.data.data.stats);
      } catch (error) {
        console.log(error);
      }
    };
    GetUsers();
  }, []);

  return (
    <Container>
      <CostumizedList />
      <Content>
        <Outlet context={[users, { types: stats.types }]} />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  width: 100%;
  height: 100vh;
  background: #fff;
`;
