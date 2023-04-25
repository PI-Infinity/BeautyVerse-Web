import React from 'react';
import { Chart } from 'react-google-charts';

export function Types({ Data }) {
  const types = [
    ['Type', 'Quantity in %'],
    ['Users', Data?.filter((item) => item.type === 'user')?.length],
    ['Specialists', Data?.filter((item) => item.type === 'specialist')?.length],
    ['Salons', Data?.filter((item) => item.type === 'beautycenter')?.length],
  ];

  const options = {
    title: 'Registered User Types',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Chart
        chartType="PieChart"
        data={types}
        options={options}
        width={'60%'}
        height={'400px'}
      />
    </div>
  );
}
