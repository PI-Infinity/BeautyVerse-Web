import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Main from './pages/main/main';
import { Feeds } from './pages/main/feeds';
import { Specialists } from './pages/main/specialists';
import { FilterMobile } from './pages/main/filterMobile';
import { Recomended } from './pages/main/recomended';
import AddFeed from './pages/addFeed/addFeed';
import Login from './pages/login/login';
import ChangePassword from './pages/login/changePassword';
import Register from './pages/register/register';
import { Identify } from './pages/register/identify';
import { BusinessRegister } from './pages/register/businessRegister';
import UserProfile from './pages/user/userProfilePage';
import { Services } from './pages/user/services';
import { UserFeeds } from './pages/user/feeds';
import { Audience } from './pages/user/audience';
import { Settings } from './pages/user/settings';
import { UserStatistics } from './pages/user/statistics/statistics';
import { Contact } from './pages/user/contact';
import AdminDashboard from './pages/adminDashboard/main';
import Users from './pages/adminDashboard/users';
import Notifications from './pages/adminDashboard/notifications';
import Reports from './pages/adminDashboard/reports';
import Statistics from './pages/adminDashboard/statistics';
import Messages from './pages/adminDashboard/messages';
import AllFeeds from './pages/adminDashboard/feeds';
import NotFound from './pages/notfound';
import { Header } from './components/header';
import { Filter } from './pages/main/filter';
import { OpenedFeed } from './pages/main/feedCard/openedFeed';
import { useDispatch, useSelector } from 'react-redux';
import { Footer } from './components/footer';
import {
  setUserList,
  setTheme,
  setLanguage,
  setCountry,
  setLoadFeeds,
  setUserListClear,
  setMachineId,
} from './redux/main';
import { GlobalStyles, darkTheme, lightTheme } from './context/theme';
import { Navigator } from './components/navigator';
import { IsMobile } from './functions/isMobile';
import useWindowDimensions from './functions/dimensions';
import SimpleBackdrop from './components/backDrop';
import { ChoiceCountry } from './components/choiceCountry';
import Headroom from 'react-headroom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { setRerenderNotifications } from './redux/rerenders';
import ScrollDialog from './components/terms';
import { Language } from './context/language';
import { privacy, terms, qa, usage } from './data/pageTexts';

function App() {
  const language = Language();
  /**
   * get user
   */

  const currentUser = JSON?.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  /**
   * Define machine unique id
   */

  useEffect(() => {
    const GetMachineId = async () => {
      const response = await axios.get(
        'https://beautyverse.herokuapp.com/machineId'
      );
      dispatch(setMachineId(response.data));
    };
    try {
      GetMachineId();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // define last visit date
  useEffect(() => {
    const GetLastVisit = async () => {
      try {
        await axios.patch(
          `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`,
          {
            lastLoginAt: new Date(),
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser) {
      GetLastVisit();
    }
  }, []);

  const [loading, setLoading] = useState(true);

  /**
   * define some needed functions
   */
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const location = useLocation();
  const dispatch = useDispatch();

  // redux imports
  const rerenderUserList = useSelector(
    (state) => state.storeRerenders.rerenderUserList
  );
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );

  const lang = useSelector((state) => state.storeMain.language);

  // open mobile filter
  const filterOpen = useSelector((state) => state.storeMain.mobileFilter);

  /**
   * Import current user
   */
  async function GetUser() {
    console.log(currentUser);
    const response = await fetch(
      `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data.user);
        localStorage.setItem(
          'Beautyverse:currentUser',
          JSON.stringify(data.data.user)
        );
      })
      .then(() => {
        dispatch(setRerenderNotifications());
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }

  React.useEffect(() => {
    if (currentUser) {
      GetUser();
    }
  }, [rerenderCurrentUser]);

  /**
   * get users with last feed
   */

  const search = useSelector((state) => state.storeFilter.search);
  const filter = useSelector((state) => state.storeFilter.filter);
  const city = useSelector((state) => state.storeFilter.cityFilter);
  const district = useSelector((state) => state.storeFilter.districtFilter);
  const specialist = useSelector((state) => state.storeFilter.specialist);
  const beautyCenter = useSelector((state) => state.storeFilter.object);

  const userList = useSelector((state) => state.storeMain.userList);

  const [page, setPage] = useState(1);

  const observer = useRef();

  const lastFeedElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  React.useEffect(() => {
    async function GetUsersWithOneFeed() {
      await dispatch(setLoadFeeds(true));
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/feeds?type=${
          specialist ? 'specialist' : ''
        }${
          beautyCenter ? 'beautyCenter' : ''
        }&city=${city}&district=${district}&filter=${filter}&search=${search}&check=${
          currentUser !== null ? currentUser._id : ''
        }&page=${page}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data.feedList);
          dispatch(setUserList(data.data.feedList));
        })
        .then(() => {
          setTimeout(() => {
            dispatch(setLoadFeeds(false));
          }, 200);
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    }
    GetUsersWithOneFeed();
  }, [
    // currentUser,
    search,
    filter,
    city,
    district,
    specialist,
    beautyCenter,
    rerenderUserList,
    page,
  ]);

  /**
   * define authentication requred routes
   */

  const RequireAdminAuth = ({ children }) => {
    return currentUser.admin ? children : <Navigate to="/" />;
  };
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };
  const RequireLogout = ({ children }) => {
    if (!currentUser) {
      return children;
    } else {
      return <Navigate to={`/api/v1/users/${currentUser?._id}`} />;
    }
  };

  /**
   * get local storage datas
   */
  useEffect(() => {
    JSON.parse(localStorage.getItem('BeautyVerse:ThemeMode')) !== null &&
      dispatch(
        setTheme(JSON.parse(localStorage.getItem('BeautyVerse:ThemeMode')))
      );
    localStorage.getItem('BeautyVerse:Language') !== null
      ? dispatch(
          setLanguage(JSON.parse(localStorage.getItem('BeautyVerse:Language')))
        )
      : dispatch(setLanguage('en'));
    localStorage.getItem('BeautyVerse:Country') !== null &&
      dispatch(
        setCountry(JSON.parse(localStorage.getItem('BeautyVerse:Country')))
      );
  }, [currentUser, lang]);

  /**
   * Define active theme mode
   */
  const theme = useSelector((state) => state.storeMain.theme);

  useEffect(() => {
    let activeTheme;
    if (theme) {
      activeTheme = 'rgba(15,15,15,15)';
    } else {
      activeTheme = '#FCFDFF';
    }
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute('content', activeTheme);
    document.body.style.background = activeTheme;
  }, [currentUser, theme]);

  /**
   * Define paths where mobile navigator is hidden
   */
  let nav;
  if (
    window.location.pathname?.includes('/chat/') ||
    window.location.pathname?.includes('/product/') ||
    window.location.pathname == '/login' ||
    window.location.pathname.includes('/resetPassword') ||
    window.location.pathname == '/register' ||
    window.location.pathname == '/register/identify' ||
    window.location.pathname == '/register/business'
  ) {
    nav = undefined;
  } else {
    nav = <Navigator setPage={setPage} />;
  }

  const headroomStyles = {
    zIndex: 1000, // Set a high z-index value for the Headroom component
  };

  // open terms and rules
  const [openTerms, setOpenTerms] = React.useState(false);
  // open privacy police
  const [openPrivacy, setOpenPrivacy] = React.useState(false);
  // open how works
  const [openUsage, setOpenUsage] = React.useState(false);
  // open question and answers
  const [openQA, setOpenQA] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  return (
    <>
      {loading ? (
        <div
          style={{
            width: width,
            height: height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            fontWeight: 'bold',
            background: theme ? '#111' : '#fff',
            color: theme ? '#fff' : '#111',
          }}
        >
          Beautyverse
        </div>
      ) : (
        <ThemeProvider theme={!theme ? lightTheme : darkTheme}>
          {/* {(!country || !language) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#111',
            backdropFilter: 'blur(20px)',
            zIndex: 10000,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChoiceCountry />
        </div>
      )} */}
          <GlobalStyles />
          <TopLine />
          <ScrollDialog
            page="terms and rules"
            title={language.language.Pages.pages.terms}
            open={openTerms}
            text={terms}
            setOpen={setOpenTerms}
            button={language.language.Pages.pages.accept}
            button2={language.language.Pages.pages.dontAccept}
            targetUser={currentUser}
          />
          <ScrollDialog
            page="privacy police"
            title={language.language.Pages.pages.privacy}
            open={openPrivacy}
            text={privacy}
            setOpen={setOpenPrivacy}
            button={language.language.Pages.pages.accept}
            button2={language.language.Pages.pages.dontAccept}
            targetUser={currentUser}
          />
          <ScrollDialog
            page="how to use?"
            title={language.language.Pages.pages.usage}
            open={openUsage}
            text={usage}
            setOpen={setOpenUsage}
            button={language.language.Pages.pages.close}
          />
          <ScrollDialog
            page="questions and answers"
            title={language.language.Pages.pages.qa}
            open={openQA}
            text={qa}
            setOpen={setOpenQA}
            button={language.language.Pages.pages.close}
          />
          {/* {loading && <Loading />} */}
          <Container>
            <SimpleBackdrop />
            {!window.location.pathname?.includes('admin') && (
              <>
                {isMobile ? (
                  <>
                    <Headroom
                      downTolerance={10}
                      upTolerance={10}
                      style={headroomStyles}
                    >
                      <Header
                        setPage={setPage}
                        setOpenTerms={setOpenTerms}
                        setOpenPrivacy={setOpenPrivacy}
                        setOpenUsage={setOpenUsage}
                        setOpenQA={setOpenQA}
                      />
                    </Headroom>
                  </>
                ) : (
                  <Header
                    setPage={setPage}
                    openTerms={openTerms}
                    setOpenTerms={setOpenTerms}
                    setOpenPrivacy={setOpenPrivacy}
                    setOpenUsage={setOpenUsage}
                    setOpenQA={setOpenQA}
                  />
                )}
              </>
            )}
            {/* {isMobile &&
          (window.location.pathname === '/' ||
            window.location.pathname === '/cards') && (
            <Filter setPage={setPage} />
          )} */}
            <Routes>
              <Route path="/" element={<Main setPage={setPage} />}>
                <Route
                  index
                  element={
                    <Feeds
                      height={height}
                      filterOpen={filterOpen}
                      lastFeedElementRef={lastFeedElementRef}
                    />
                  }
                />
                <Route
                  path="cards"
                  element={
                    <Specialists
                      setPage={setPage}
                      lastFeedElementRef={lastFeedElementRef}
                    />
                  }
                  direction="row"
                />
                <Route
                  path="filterMobile"
                  element={<FilterMobile setPage={setPage} />}
                  direction="row"
                />
                <Route
                  path="add"
                  element={<AddFeed setPage={setPage} />}
                  direction="row"
                />
                <Route
                  path="recomended"
                  element={
                    <Recomended
                      setPage={setPage}
                      lastFeedElementRef={lastFeedElementRef}
                    />
                  }
                  direction="row"
                />
              </Route>
              <Route
                path="api/v1/users/:id/feeds/:feedId"
                element={<OpenedFeed />}
              />
              <Route
                path="api/v1/users/:id/feeds/:feedId/profile"
                element={<OpenedFeed />}
              />
              <Route
                path="/login"
                element={
                  // <RequireLogout>
                  <Login />
                }
              />
              <Route
                path="/resetPassword/:resetId"
                element={
                  <RequireLogout>
                    <ChangePassword />
                  </RequireLogout>
                }
              />

              <Route path="api/v1/users/:id" element={<UserProfile />}>
                <Route index element={<UserFeeds />} />

                <Route path="services" element={<Services />} />

                {/* */}
                {/* <Route path="team" element={<Team />} /> */}
                {/*  */}
                <Route path="contact" element={<Contact />} />
                <Route path="audience" element={<Audience />} />

                {/* <Route path="statistics" element={<UserStatistics />} /> */}

                <Route
                  path="settings"
                  element={
                    <RequireAuth>
                      <Settings />
                    </RequireAuth>
                  }
                />
              </Route>
              {/* <Route path="/marketplace" element={<Marketplace />}>
              <Route index element={<MarketplaceMain />} />
              <Route path="cart" element={<Cart />} />
              <Route path="market" element={<Market />}>
                <Route path=":Cetegory" element={<Market />}></Route>
              </Route>
            </Route>
            <Route
              path="/marketplace/:ShopId/product/:Id"
              element={<Product />}
            /> */}
              <Route
                path="admin"
                element={
                  <RequireAdminAuth>
                    <AdminDashboard />
                  </RequireAdminAuth>
                }
              >
                <Route
                  index
                  element={
                    <RequireAdminAuth>
                      <Users />
                    </RequireAdminAuth>
                  }
                />
                <Route
                  path="statistics"
                  element={
                    <RequireAdminAuth>
                      <Statistics />
                    </RequireAdminAuth>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <RequireAdminAuth>
                      <Notifications />
                    </RequireAdminAuth>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <RequireAdminAuth>
                      <Reports />
                    </RequireAdminAuth>
                  }
                />
                <Route
                  path="messages"
                  element={
                    <RequireAdminAuth>
                      <Messages />
                    </RequireAdminAuth>
                  }
                />
                <Route
                  path="feeds"
                  element={
                    <RequireAdminAuth>
                      <AllFeeds />
                    </RequireAdminAuth>
                  }
                />
              </Route>
              {/* <Route
            path="/chat"
            element={
              <RequireAuth>
                <Chat
                  
                  SOCKET_SERVER={SOCKET_SERVER}
                  handleRoomChange={handleRoomChange}
                  room={room}
                />
              </RequireAuth>
            }
          /> */}
              {/* <Route
            path="/chat/:id"
            element={
              <RequireAuth>
                <ChatContent />
              </RequireAuth>
            }
          /> */}
              <Route
                path="/register"
                element={
                  <RequireLogout>
                    <Register />
                  </RequireLogout>
                }
              ></Route>
              <Route
                path="/register/identify"
                element={
                  <RequireLogout>
                    <Identify />
                  </RequireLogout>
                }
              ></Route>
              <Route
                path="/register/business"
                element={
                  <RequireLogout>
                    <BusinessRegister />
                  </RequireLogout>
                }
              ></Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            {!window.location.pathname?.includes('admin') && <Footer />}
            {!window.location.pathname?.includes('admin') &&
              !window.location.pathname?.includes('feed/') && <>{nav}</>}
          </Container>
          {/* )} */}
        </ThemeProvider>
      )}
    </>
  );
}

export default App;

const Container = styled.div`
  background: ${(props) => props.theme.background};
`;

const TopLine = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 0.22vw;
  background: linear-gradient(
    226deg,
    #2bdf61,
    #dfc32b,
    #ce2bdf,
    #2bc6df,
    #df2bb8,
    #2b8edf,
    #d3df2b,
    #2bdfd9,
    #df8c2b,
    #2bbedf,
    #df2bb0,
    #c3df2b,
    #ea7c7c,
    #2bdf61,
    #dfc32b
  );
  background-size: 800% 800%;
  z-index: 10;

  @media only screen and (max-width: 600px) {
    height: 0;
    display: none;
  }

  -webkit-animation: AnimationName 30s ease infinite;
  -moz-animation: AnimationName 30s ease infinite;
  -o-animation: AnimationName 30s ease infinite;
  animation: AnimationName 30s ease infinite;

  @-webkit-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @-moz-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @-o-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
