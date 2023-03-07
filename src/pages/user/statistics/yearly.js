import React, { useEffect } from "react";
import styled from "styled-components";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../../../firebase";
import { useSelector, useDispatch } from "react-redux";
import { Chart } from "react-google-charts";
import { IsMobile } from "../../../functions/isMobile";
import { BiStar } from "react-icons/bi";
import { ImCheckmark } from "react-icons/im";
import { AiOutlineEye } from "react-icons/ai";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { MdDynamicFeed } from "react-icons/md";

export function Yearly(props) {
  const isMobile = IsMobile();

  // import followings
  const folls = useSelector((state) => state.storeMain.followings);
  let followings;
  if (folls?.length > 0) {
    followings = JSON.parse(folls);
  }

  // feeds stats
  const [count, setCount] = React.useState("");
  useEffect(() => {
    const Getting = async () => {
      const coll = collection(db, "users", props?.user?.id, "feeds");
      const snapshot = await getCountFromServer(coll);
      setCount(snapshot.data().count);
    };
    Getting();
  }, []);

  return (
    <>
      <Stats>
        <ImCheckmark color="#2bdfd9" />{" "}
        {props?.language?.language.User.userPage.followers}:{" "}
        {props?.followers?.length}
      </Stats>
      <Stats>
        <ImCheckmark color="orange" />{" "}
        {props?.language?.language.User.userPage.followings}:{" "}
        {followings?.length}
      </Stats>
      <Stats>
        <BiStar color="#bb3394" />
        {props?.language?.language.User.userPage.stars}: {props?.stars?.length}
      </Stats>
      <Stats>
        <MdDynamicFeed color="orange" />
        {props?.language?.language.User.userPage.feeds}: {count}
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
