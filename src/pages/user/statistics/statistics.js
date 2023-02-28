import React, { useEffect, useState } from "react";
import styledcomponent from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../../context/AuthContext";
import { IsMobile } from "../../../functions/isMobile";
import { useOutletContext, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import ChangePassword from "../../../pages/user/changePassword";
import Success from "../../../snackBars/success";
import { db } from "../../../firebase";
import { collection, onSnapshot, collectionGroup } from "firebase/firestore";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { styled } from "@mui/material/styles";
import { Daily } from "../../../pages/user/statistics/daily";
import { Weekly } from "../../../pages/user/statistics/weekly";
import { Monthly } from "../../../pages/user/statistics/monthly";
import { Yearly } from "../../../pages/user/statistics/yearly";
import useWindowDimensions from "../../../functions/dimensions";

export const UserStatistics = () => {
  const [user, language] = useOutletContext();
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = React.useContext(AuthContext);

  // define theme
  const theme = useSelector((state) => state.storeMain.theme);

  // tab state
  const [value, setValue] = React.useState(0);

  /**
   * get statistics from firebase
   */
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${currentUser?.uid}`, "visitors-profile"),
      (snapshot) => {
        setStats(snapshot.docs.map((doc) => doc.data()));
      }
    );
    return data;
  }, [currentUser]);

  // define followers
  const [followers, setFollowers] = useState([]);
  React.useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${user?.id}`, "followers"),
      (snapshot) => {
        setFollowers(snapshot.docs.map((doc) => doc.data()));
      }
    );
  }, [currentUser]);
  /**
   * Define starts
   */
  const [stars, setStars] = useState([]);
  const DefineStars = () => {
    const starsGroupRef = onSnapshot(
      collectionGroup(db, `${user?.id + "+stars"}`),
      (snapshot) => {
        setStars(snapshot.docs.map((doc) => doc.data()));
      }
    );
  };

  useEffect(() => {
    DefineStars();
  }, [currentUser]);

  // weekly
  const weekly = stats?.filter((item, index) => {
    if (
      item?.indicator?.slice(0, 3) === new Date().toString().slice(4, 7) &&
      item?.indicator?.slice(7, 11) === new Date().toString().slice(11, 15)
    ) {
      if (
        item.indicator.slice(4, 6) === new Date().toString().slice(8, 10) ||
        parseInt(item.indicator.slice(4, 6)) ===
          parseInt(new Date().toString().slice(8, 10) - 1) ||
        parseInt(item.indicator.slice(4, 6)) ===
          parseInt(new Date().toString().slice(8, 10) - 2) ||
        parseInt(item.indicator.slice(4, 6)) ===
          parseInt(new Date().toString().slice(8, 10) - 3) ||
        parseInt(item.indicator.slice(4, 6)) ===
          parseInt(new Date().toString().slice(8, 10) - 4) ||
        parseInt(item.indicator.slice(4, 6)) ===
          parseInt(new Date().toString().slice(8, 10) - 5) ||
        parseInt(item.indicator.slice(4, 6)) ===
          parseInt(new Date().toString().slice(8, 10) - 6)
      )
        return item;
    }
  });

  // define active tab
  let activeTab;
  if (value === 0) {
    activeTab = (
      <Daily stats={stats} theme={theme} followers={followers} stars={stars} />
    );
  } else if (value === 1) {
    activeTab = (
      <Weekly stats={stats} theme={theme} followers={followers} stars={stars} />
    );
  } else if (value === 2) {
    activeTab = (
      <Monthly
        stats={stats}
        theme={theme}
        followers={followers}
        stars={stars}
      />
    );
  } else {
    activeTab = (
      <Yearly
        stats={stats}
        theme={theme}
        followers={followers}
        stars={stars}
        user={user}
      />
    );
  }

  return (
    <Container height={height}>
      <div style={{ margin: "2% 0 0 2%", height: "60px" }}>
        <CenteredTabs value={value} setValue={setValue} />
      </div>
      <Content>{activeTab}</Content>
    </Container>
  );
};

// create tab navigator

const StyledTab = styled(Tab)({
  "&.Mui-selected": {
    color: "secondary",
    fontSize: "14px",
    "@media only screen and (max-width: 1200px)": {
      fontSize: "10px",
    },
  },
  "&.MuiTab-root": {
    color: "#ee99fc",
    fontSize: "14px",
    "@media only screen and (max-width: 1200px)": {
      fontSize: "10px",
    },
  },
});

function CenteredTabs({ value, setValue }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", color: "#fff" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="secondary"
      >
        <StyledTab label="Daily" />
        <StyledTab label="Weekly" />
        <StyledTab label="Monthly" />
        <StyledTab label="All" />
      </Tabs>
    </Box>
  );
}

const Container = styledcomponent.div`
  height: 28vw;
  width: 100%;
  overflow-y: scroll;
  box-sizing: border-box;
  overflow-x: hidden;
  
  @media only screen and (max-width: 600px) {
    height: calc(${(props) => props.height}px - 40vw);
  }
`;

const Content = styledcomponent.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 2vw;
  width: 100%;
  height: auto;
  padding-bottom: 3vw;
  min-height: 20vw;
  gap: 1vw;
  overflow-y: scroll;


  .loadingIcon {
    font-size: 3vw;
  }

  @media only screen and (max-width: 600px) {
    justify-content: start;
    padding: 2vw 3vw;
    gap: 3vw;
    width: 97%;
    height: auto;
    overflow-x: hidden;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 0.3vw;
    height: 0vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #222;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;
