import React from 'react';
import { Chart } from 'react-google-charts';
import styled from 'styled-components';
import { Types } from '../../pages/adminDashboard/statistics-types';
import { Location } from '../../pages/adminDashboard/statistics-location';
import { useSelector, useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';

export default function Statistics() {
  const [types] = useOutletContext();

  const data = [
    ['Year', 'Users', 'Salons', 'Specialists'],
    ['2014', 1000, 400, 200],
    ['2015', 1170, 460, 250],
    ['2016', 660, 1120, 300],
    ['2017', 1030, 540, 350],
  ];

  const options = {
    chart: {
      title: 'Registrations',
    },
  };

  return (
    <Container>
      <Chart
        chartType="Bar"
        width="80%"
        height="400px"
        data={data}
        options={options}
      />
      <Types Data={types} />
      <Location Data={types} />
      {/* <UserPie Data={types} /> */}
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  overflow-y: scroll;
  height: 100%;
`;
