import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Chart } from 'react-google-charts';
import { IsMobile } from '../../../functions/isMobile';
import { BiStar } from 'react-icons/bi';
import { ImCheckmark } from 'react-icons/im';
import { AiOutlineEye } from 'react-icons/ai';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useSelector } from 'react-redux';

export function Daily(props) {
  const isMobile = IsMobile();
  const statistics = useSelector((state) => state.storeUser.statistics);
  console.log(statistics?.dinamically?.dailyInLastMonth);
  console.log(statistics);
  const DefineData = () => {
    const labels = [
      'Days',
      `${props?.language?.language.User.userPage.visitors}`,
      `${props?.language?.language.User.userPage.followers}`,
      `${props?.language?.language.User.userPage.stars}`,
    ];

    const dataPoints = statistics?.dinamically?.dailyInLastMonth?.map(
      (item, index) => {
        return item;
      }
    );

    return [labels].concat(dataPoints);
  };

  const data = DefineData();

  const options = {
    chart: {},
    backgroundColor: props?.theme ? '#222' : 'rgba(255,255,255,0)',
    colors: ['orange', '#2bdfd9', '#bb3394'],
    title:
      new Date()?.toString()?.slice(4, 7) +
      new Date()?.toString()?.slice(10, 15),
    titleTextStyle: {
      color: props?.theme ? '#fff' : '#222', // color 'red' or '#cc00cc'
      fontName: 'Courier New', // 'Times New Roman'
      fontSize: 14, // 12, 18
      bold: true, // true or false
    },
    hAxis: {
      textStyle: {
        fontSize: 12,
        color: props?.theme ? '#fff' : '#222',
      },
    },
    vAxis: {
      textStyle: {
        fontSize: 12,
        color: props?.theme ? '#fff' : '#222',
      },
    },
    legend: {
      textStyle: {
        fontSize: 12,
        color: props?.theme ? '#fff' : '#222',
      },
    },
  };
  return (
    <>
      <Stats>
        <AiOutlineEye color="orange" />{' '}
        {props?.language?.language.User.userPage.visitors}:{' '}
        {statistics?.visitors?.daily}
      </Stats>
      <Stats>
        <ImCheckmark color="#2bdfd9" />{' '}
        {props?.language?.language.User.userPage.followers}:{' '}
        {statistics?.followers?.daily}
      </Stats>
      <Stats>
        <BiStar color="#bb3394" />{' '}
        {props?.language?.language.User.userPage.stars}:{' '}
        {statistics?.stars?.daily}
      </Stats>
      <Stats>
        {props?.language?.language.User.userPage.lastMonthStats}{' '}
        <ShowChartIcon />
      </Stats>
      <Scrollable>
        <div>
          <Chart
            chartType="AreaChart"
            width={isMobile ? '1800px' : '950px'}
            height="250px"
            data={data}
            options={options}
          />
        </div>
      </Scrollable>
    </>
  );
}

const Stats = styled.div`
  padding: 0px 10px;
  color: ${(props) => props.theme.font};
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
`;
const Scrollable = styled.div`
  width: 800px;
  height: 310px;
  margin: 2px 10px;
  color: ${(props) => props.theme.font};

  & > div {
    position: relative;
    right: 80px;
    @media only screen and (max-width: 600px) {
      right: 140px;
    }
  }

  @media only screen and (max-width: 600px) {
    overflow-x: scroll;
    overflow-y: hidden;
    height: 350px;
    padding: 0;
    width: 100%;
    // position: absolute;
    // margin-right: 20vw;
  }
`;
