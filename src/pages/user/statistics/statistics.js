import React, { useEffect, useState } from 'react';
import styledcomponent from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { IsMobile } from '../../../functions/isMobile';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { db } from '../../../firebase';
import { collection, onSnapshot, collectionGroup } from 'firebase/firestore';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from '@mui/material/styles';
import { Daily } from '../../../pages/user/statistics/daily';
import { Weekly } from '../../../pages/user/statistics/weekly';
import { Monthly } from '../../../pages/user/statistics/monthly';
import { Yearly } from '../../../pages/user/statistics/yearly';
import useWindowDimensions from '../../../functions/dimensions';
import { Spinner } from '../../../components/loader';
import { setStatistics } from '../../../redux/user';

export const UserStatistics = () => {
  const [targetUser, language] = useOutletContext();
  const [loading, setLoading] = React.useState(true);

  // import current user from redux state
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  useEffect(() => {
    async function GetAudience(userId) {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/statistics`
      )
        .then((response) => response.json())
        .then((data) => {
          dispatch(setStatistics(data.data.data));
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    }
    if (currentUser) {
      GetAudience();
    }
  }, [targetUser?._id]);

  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // define theme
  const theme = useSelector((state) => state.storeMain.theme);

  // tab state
  const [value, setValue] = React.useState(0);

  // define active tab
  let activeTab;
  if (value === 0) {
    activeTab = <Daily theme={theme} language={language} />;
  } else if (value === 1) {
    activeTab = <Weekly theme={theme} language={language} />;
  } else if (value === 2) {
    activeTab = <Monthly theme={theme} language={language} />;
  } else {
    activeTab = <Yearly theme={theme} user={targetUser} language={language} />;
  }

  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <Container height={height}>
      <div style={{ margin: '2% 0 0 2%', height: '60px' }}>
        <CenteredTabs value={value} setValue={setValue} language={language} />
      </div>
      <Content>{activeTab}</Content>
    </Container>
  );
};

// create tab navigator

const StyledTab = styled(Tab)({
  '&.Mui-selected': {
    color: 'secondary',
    fontSize: '14px',
    '@media only screen and (max-width: 1200px)': {
      fontSize: '12px',
    },
  },
  '&.MuiTab-root': {
    color: '#ee99fc',
    fontSize: '14px',
    '@media only screen and (max-width: 1200px)': {
      fontSize: '12px',
    },
  },
});

function CenteredTabs({ value, setValue, language }) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', color: '#fff' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textcolor="secondary"
      >
        <StyledTab label={language?.language.User.userPage.daily} />
        <StyledTab label={language?.language.User.userPage.weekly} />
        <StyledTab label={language?.language.User.userPage.monthly} />
        <StyledTab label={language?.language.User.userPage.all} />
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
    height: auto;

    /* width */
::-webkit-scrollbar {
  width: 0vw;
  height: 0vw;
}

/* Track */
::-webkit-scrollbar-track {
  background-color: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #222;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: #1e1e1e;
}
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
