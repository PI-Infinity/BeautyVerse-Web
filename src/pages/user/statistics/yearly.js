import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { Chart } from 'react-google-charts';
import { IsMobile } from '../../../functions/isMobile';
import { BiStar } from 'react-icons/bi';
import { ImCheckmark } from 'react-icons/im';
import { AiOutlineEye } from 'react-icons/ai';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { MdDynamicFeed } from 'react-icons/md';

export function Yearly(props) {
  const isMobile = IsMobile();

  /**
   * Define start total
   */
  const [stars, setStars] = useState([]);

  let followings = useSelector((state) => state.storeUser.targetUserFollowings);
  let followers = useSelector((state) => state.storeUser.targetUserFollowers);
  let feeds = useSelector((state) => state.storeUser.targetUserFeeds);

  async function GetStars() {
    const response = await fetch(
      `https://beautyverse.herokuapp.com/api/v1/users/${props?.user._id}/stars`
    )
      .then((response) => response.json())
      .then(async (data) => {
        setStars(data.data.stars);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }

  useEffect(() => {
    GetStars();
  }, []);

  return (
    <>
      <Stats>
        <ImCheckmark color="#2bdfd9" />{' '}
        {props?.language?.language.User.userPage.followers}:{' '}
        {followers?.list?.length}
      </Stats>
      <Stats>
        <ImCheckmark color="orange" />{' '}
        {props?.language?.language.User.userPage.followings}:{' '}
        {followings?.list?.length}
      </Stats>
      <Stats>
        <BiStar color="#bb3394" />
        {props?.language?.language.User.userPage.stars}: {stars}
      </Stats>
      <Stats>
        <MdDynamicFeed color="orange" />
        {props?.language?.language.User.userPage.feeds}: {feeds?.length}
      </Stats>
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
      right: 77px;
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
