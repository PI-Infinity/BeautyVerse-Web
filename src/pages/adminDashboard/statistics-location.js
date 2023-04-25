import React from 'react';
import { Chart } from 'react-google-charts';

export function Location({ Data }) {
  const types = [
    ['Countries', 'Quantity in %'],
    ['Users', Data?.filter((item) => item.type === 'user')?.length],
    ['Specialists', Data?.filter((item) => item.type === 'specialist')?.length],
    ['Salons', Data?.filter((item) => item.type === 'beautycenter')?.length],
  ];

  const options = {
    title: 'Registered User Countries',
  };
  // const countries = [
  //   ['Cities', 'Quantity in %'],
  //   ['Users', Data?.filter((item) => item.type === 'user')?.length],
  //   ['Specialists', Data?.filter((item) => item.type === 'specialist')?.length],
  //   ['Salons', Data?.filter((item) => item.type === 'beautycenter')?.length],
  // ];

  // const options2 = {
  //   title: 'Registered User Cities',
  // };
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Chart
        chartType="PieChart"
        data={types}
        options={options}
        width={'20%'}
        height={'300px'}
      />
      {/* <Chart
        chartType="PieChart"
        data={countries}
        options={options2}
        width={'20%'}
        height={'300px'}
      />
      <Chart
        chartType="PieChart"
        data={countries}
        options={options2}
        width={'20%'}
        height={'300px'}
      /> */}
    </div>
  );
}
