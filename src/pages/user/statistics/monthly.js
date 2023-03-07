import React from "react";
import styled from "styled-components";
import { Chart } from "react-google-charts";
import { IsMobile } from "../../../functions/isMobile";
import { BiStar } from "react-icons/bi";
import { ImCheckmark } from "react-icons/im";
import { AiOutlineEye } from "react-icons/ai";
import ShowChartIcon from "@mui/icons-material/ShowChart";

export function Monthly(props) {
  const isMobile = IsMobile();
  // dailiy visitors
  const monthly = props?.stats?.filter((item, index) => {
    if (item?.indicator?.slice(0, 3) === new Date()?.toString().slice(4, 7)) {
      return item;
    }
  });
  // dailiy followers
  const followers = props?.followers?.filter((item, index) => {
    if (
      new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) ===
      new Date()?.toString().slice(4, 7)
    ) {
      return item;
    }
  });
  // dailiy followers
  const stars = props?.stars?.filter((item, index) => {
    if (
      new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) ===
      new Date()?.toString().slice(4, 7)
    ) {
      return item;
    }
  });

  // define each month visitors in last year
  const DefineVisitors = (day) => {
    let jan = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Jan"
    );
    let feb = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Feb"
    );
    let mar = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Mar"
    );
    let apr = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Apr"
    );
    let may = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "May"
    );
    let jun = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Jun"
    );
    let jul = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Jul"
    );
    let aug = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Aug"
    );
    let sep = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Sep"
    );
    let oct = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Oct"
    );
    let nov = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Nov"
    );
    let dec = props?.stats?.filter(
      (item) => item?.indicator?.slice(0, 3) === "Dec"
    );
    return {
      jan: jan?.length,
      feb: feb?.length,
      mar: mar?.length,
      apr: apr?.length,
      may: may?.length,
      jun: jun?.length,
      jul: jul?.length,
      aug: aug?.length,
      sep: sep?.length,
      oct: oct?.length,
      nov: nov?.length,
      dec: dec?.length,
    };
  };
  const monthStats = DefineVisitors();

  // define each day followers in last month
  const DefineFollowers = (day) => {
    let jan = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Jan"
    );
    let feb = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Feb"
    );
    let mar = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Mar"
    );
    let apr = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Apr"
    );
    let may = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "May"
    );
    let jun = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Jun"
    );
    let jul = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Jul"
    );
    let aug = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Aug"
    );
    let sep = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Sep"
    );
    let oct = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Oct"
    );
    let nov = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Nov"
    );
    let dec = props?.followers?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Dec"
    );
    return {
      jan: jan?.length,
      feb: feb?.length,
      mar: mar?.length,
      apr: apr?.length,
      may: may?.length,
      jun: jun?.length,
      jul: jul?.length,
      aug: aug?.length,
      sep: sep?.length,
      oct: oct?.length,
      nov: nov?.length,
      dec: dec?.length,
    };
  };

  const monthlyFollowers = DefineFollowers();

  // define each day stars in last month
  const DefineStars = (day) => {
    let jan = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Jan"
    );
    let feb = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Feb"
    );
    let mar = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Mar"
    );
    let apr = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Apr"
    );
    let may = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "May"
    );
    let jun = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Jun"
    );
    let jul = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Jul"
    );
    let aug = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Aug"
    );
    let sep = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Sep"
    );
    let oct = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Oct"
    );
    let nov = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Nov"
    );
    let dec = props?.stars?.filter(
      (item) =>
        new Date(item?.date?.seconds * 1000)?.toString()?.slice(4, 7) === "Dec"
    );
    return {
      jan: jan?.length,
      feb: feb?.length,
      mar: mar?.length,
      apr: apr?.length,
      may: may?.length,
      jun: jun?.length,
      jul: jul?.length,
      aug: aug?.length,
      sep: sep?.length,
      oct: oct?.length,
      nov: nov?.length,
      dec: dec?.length,
    };
  };

  const monthlyStars = DefineStars();

  // cretate chart

  const DefineData = () => {
    const dat = [
      ["Months", "Visitors", "Followers", "Stars"],
      ["Jan", monthStats?.jan, monthlyFollowers?.jan, monthlyStars?.jan],
      ["Feb", monthStats?.feb, monthlyFollowers?.feb, monthlyStars?.feb],
      ["Mar", monthStats?.mar, monthlyFollowers?.mar, monthlyStars?.mar],
      ["Apr", monthStats?.apr, monthlyFollowers?.apr, monthlyStars?.apr],
      ["May", monthStats?.may, monthlyFollowers?.may, monthlyStars?.may],
      ["Jun", monthStats?.jun, monthlyFollowers?.jun, monthlyStars?.jun],
      ["Jul", monthStats?.jul, monthlyFollowers?.jul, monthlyStars?.jul],
      ["Aug", monthStats?.aug, monthlyFollowers?.aug, monthlyStars?.aug],
      ["Sep", monthStats?.sep, monthlyFollowers?.sep, monthlyStars?.sep],
      ["Oct", monthStats?.oct, monthlyFollowers?.oct, monthlyStars?.oct],
      ["Nov", monthStats?.nov, monthlyFollowers?.nov, monthlyStars?.nov],
    ];

    return dat;
  };

  const data = DefineData();

  const options = {
    chart: {},
    backgroundColor: props?.theme ? "#222" : "rgba(255,255,255,0)",
    colors: ["orange", "#2bdfd9", "#bb3394"],
    title: new Date()?.toString()?.slice(10, 15) + " Year",
    titleTextStyle: {
      color: props?.theme ? "#fff" : "#222", // color 'red' or '#cc00cc'
      fontName: "Courier New", // 'Times New Roman'
      fontSize: 14, // 12, 18
      bold: true, // true or false
    },
    hAxis: {
      textStyle: {
        fontSize: 12,
        color: props?.theme ? "#fff" : "#222",
      },
    },
    vAxis: {
      textStyle: {
        fontSize: 12,
        color: props?.theme ? "#fff" : "#222",
      },
    },
    legend: {
      textStyle: {
        fontSize: 12,
        color: props?.theme ? "#fff" : "#222",
      },
    },
  };

  // define months

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const d = new Date().toLocaleString("default", { month: "long" });
  // document.write("The current month is " + monthNames[d.getMonth()]);
  return (
    <>
      <Stats>
        <AiOutlineEye color="orange" />
        {d} {props?.language?.language.User.userPage.visitors}:{" "}
        {monthly?.length}
      </Stats>
      <Stats>
        <ImCheckmark color="#2bdfd9" />
        {d} {props?.language?.language.User.userPage.followers}:{" "}
        {followers?.length}
      </Stats>
      <Stats>
        <BiStar color="#bb3394" />
        {d} {props?.language?.language.User.userPage.stars}: {stars?.length}
      </Stats>
      <Stats>
        {props?.language?.language.User.userPage.lastMonthsStats}{" "}
        <ShowChartIcon />
      </Stats>
      <Scrollable>
        <div>
          <Chart
            chartType="AreaChart"
            width={isMobile ? "800px" : "950px"}
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
