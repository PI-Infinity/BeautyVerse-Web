import React from 'react';
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
  const followers = useSelector((state) => state.storeUser.targetUserFollowers);
  const dailyfollowers = followers?.list?.filter(
    (item) =>
      item?.followAt?.slice(0, 10) === new Date()?.toISOString().slice(0, 10)
  );

  // cretate chart

  const DefineData = () => {
    const dat = [
      [
        'Days',
        `${props?.language?.language.User.userPage.visitors}`,
        `${props?.language?.language.User.userPage.followers}`,
        `${props?.language?.language.User.userPage.stars}`,
      ],
    ];
    for (var i = 1; i <= parseInt(new Date()?.toString().slice(8, 10)); i++) {
      // let obj = DefineVisitoris(i - 1);
      // let visitors = parseInt(obj?.length);
      // let obj2 = DefineFollowers(i - 1);
      // let followers = parseInt(obj2?.length);
      // let obj3 = DefineStars(i - 1);
      // let stars = parseInt(obj3?.length);
      // let day =
      //   `${new Date()?.toString().slice(8, 10) - i + 1}` +
      //   ` ${new Date()?.toString().slice(4, 7)}`;
      // dat.push([day, visitors, followers, stars]);
    }
    return dat;
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
        {/* {props?.language?.language.User.userPage.todayVisitors}: {daily?.length} */}
      </Stats>
      <Stats>
        <ImCheckmark color="#2bdfd9" />{' '}
        {props?.language?.language.User.userPage.todayFollowers}:{' '}
        {dailyfollowers?.length}
      </Stats>
      <Stats>
        <BiStar color="#bb3394" />{' '}
        {/* {props?.language?.language.User.userPage.todayStars}: {stars?.length} */}
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
